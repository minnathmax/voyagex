/**
 * LocalDB — A lightweight JSON-file database that mirrors MongoDB's API.
 * 
 * Data persists in /localdb/*.json files between server restarts.
 * When you're ready, run `node pushToAtlas.js` to migrate everything to MongoDB Atlas.
 */

const fs = require('fs');
const path = require('path');

const DB_DIR = path.join(__dirname, 'localdb');

// Ensure the directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

class LocalCollection {
  constructor(name) {
    this.name = name;
    this.filePath = path.join(DB_DIR, `${name}.json`);
    this._ensureFile();
  }

  _ensureFile() {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, '[]', 'utf-8');
    }
  }

  _read() {
    try {
      const raw = fs.readFileSync(this.filePath, 'utf-8');
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  }

  _write(data) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  _generateId() {
    return 'local_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 8);
  }

  _matchesQuery(doc, query) {
    for (const key of Object.keys(query)) {
      const val = query[key];

      // Handle dot notation (e.g., "location.city")
      const keys = key.split('.');
      let docVal = doc;
      for (const k of keys) {
        if (docVal == null) return false;
        docVal = docVal[k];
      }

      // Handle $regex
      if (val && typeof val === 'object' && val.$regex) {
        const flags = val.$options || '';
        const regex = new RegExp(val.$regex, flags);
        if (!regex.test(docVal)) return false;
        continue;
      }

      // Handle $gte, $lte
      if (val && typeof val === 'object' && (val.$gte !== undefined || val.$lte !== undefined)) {
        if (val.$gte !== undefined && docVal < val.$gte) return false;
        if (val.$lte !== undefined && docVal > val.$lte) return false;
        continue;
      }

      // Handle $in
      if (val && typeof val === 'object' && val.$in) {
        if (Array.isArray(docVal)) {
          if (!val.$in.some(v => docVal.includes(v))) return false;
        } else {
          if (!val.$in.includes(docVal)) return false;
        }
        continue;
      }

      // Handle $ne
      if (val && typeof val === 'object' && val.$ne !== undefined) {
        if (docVal === val.$ne) return false;
        continue;
      }

      // Direct comparison
      if (Array.isArray(docVal)) {
        if (!docVal.includes(val)) return false;
      } else {
        if (docVal !== val) return false;
      }
    }
    return true;
  }

  // --- MongoDB-like API ---

  find(query = {}) {
    const data = this._read();
    let results = data.filter(doc => this._matchesQuery(doc, query));

    // Chainable helpers
    const chain = {
      _results: results,
      sort(sortObj) {
        const key = Object.keys(sortObj)[0];
        const dir = sortObj[key];
        this._results.sort((a, b) => {
          if (a[key] < b[key]) return -1 * dir;
          if (a[key] > b[key]) return 1 * dir;
          return 0;
        });
        return this;
      },
      skip(n) {
        this._results = this._results.slice(n);
        return this;
      },
      limit(n) {
        this._results = this._results.slice(0, n);
        return this;
      },
      select(fields) {
        // No-op for local DB, return all fields
        return this;
      },
      populate(field) {
        // No-op for local DB
        return this;
      },
      lean() {
        return this;
      },
      then(resolve, reject) {
        try {
          resolve(this._results);
        } catch (e) {
          if (reject) reject(e);
        }
      },
      // Make it awaitable
      [Symbol.toStringTag]: 'Promise',
    };

    // Make it thenable (async/await compatible)
    chain.then = chain.then.bind(chain);
    return chain;
  }

  async findOne(query = {}) {
    const data = this._read();
    return data.find(doc => this._matchesQuery(doc, query)) || null;
  }

  async findById(id) {
    const data = this._read();
    return data.find(doc => doc._id === id) || null;
  }

  async countDocuments(query = {}) {
    const data = this._read();
    return data.filter(doc => this._matchesQuery(doc, query)).length;
  }

  async create(docOrDocs) {
    const data = this._read();
    const isArray = Array.isArray(docOrDocs);
    const docs = isArray ? docOrDocs : [docOrDocs];

    const created = docs.map(doc => ({
      _id: doc._id || this._generateId(),
      ...doc,
      createdAt: doc.createdAt || new Date().toISOString(),
      updatedAt: doc.updatedAt || new Date().toISOString(),
    }));

    data.push(...created);
    this._write(data);
    return isArray ? created : created[0];
  }

  async findOneAndUpdate(query, update, options = {}) {
    const data = this._read();
    const idx = data.findIndex(doc => this._matchesQuery(doc, query));

    if (idx === -1) {
      if (options.upsert) {
        const newDoc = { _id: this._generateId(), ...query, ...(update.$set || update), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        data.push(newDoc);
        this._write(data);
        return newDoc;
      }
      return null;
    }

    const changes = update.$set || update;
    if (update.$inc) {
      for (const [k, v] of Object.entries(update.$inc)) {
        data[idx][k] = (data[idx][k] || 0) + v;
      }
    }
    if (update.$push) {
      for (const [k, v] of Object.entries(update.$push)) {
        if (!Array.isArray(data[idx][k])) data[idx][k] = [];
        data[idx][k].push(v);
      }
    }
    Object.assign(data[idx], changes, { updatedAt: new Date().toISOString() });

    this._write(data);
    return options.new !== false ? data[idx] : data[idx];
  }

  async updateOne(query, update) {
    return this.findOneAndUpdate(query, update);
  }

  async updateMany(query, update) {
    const data = this._read();
    let count = 0;
    data.forEach((doc, idx) => {
      if (this._matchesQuery(doc, query)) {
        const changes = update.$set || update;
        Object.assign(data[idx], changes, { updatedAt: new Date().toISOString() });
        count++;
      }
    });
    this._write(data);
    return { modifiedCount: count };
  }

  async findByIdAndUpdate(id, update, options = {}) {
    return this.findOneAndUpdate({ _id: id }, update, options);
  }

  async findByIdAndDelete(id) {
    const data = this._read();
    const idx = data.findIndex(doc => doc._id === id);
    if (idx === -1) return null;
    const removed = data.splice(idx, 1)[0];
    this._write(data);
    return removed;
  }

  async deleteOne(query) {
    const data = this._read();
    const idx = data.findIndex(doc => this._matchesQuery(doc, query));
    if (idx === -1) return { deletedCount: 0 };
    data.splice(idx, 1);
    this._write(data);
    return { deletedCount: 1 };
  }

  async deleteMany(query) {
    const data = this._read();
    const before = data.length;
    const remaining = data.filter(doc => !this._matchesQuery(doc, query));
    this._write(remaining);
    return { deletedCount: before - remaining.length };
  }

  async aggregate(pipeline) {
    // Basic aggregation support for common ops
    let data = this._read();

    for (const stage of pipeline) {
      if (stage.$match) {
        data = data.filter(doc => this._matchesQuery(doc, stage.$match));
      }
      if (stage.$group) {
        const groups = {};
        for (const doc of data) {
          const key = stage.$group._id ? doc[stage.$group._id.replace('$', '')] : 'all';
          if (!groups[key]) groups[key] = { _id: key, docs: [] };
          groups[key].docs.push(doc);
        }
        data = Object.values(groups).map(g => {
          const result = { _id: g._id };
          for (const [field, op] of Object.entries(stage.$group)) {
            if (field === '_id') continue;
            if (op.$sum === 1) result[field] = g.docs.length;
            else if (op.$sum) result[field] = g.docs.reduce((s, d) => s + (d[op.$sum.replace('$', '')] || 0), 0);
            else if (op.$avg) result[field] = g.docs.reduce((s, d) => s + (d[op.$avg.replace('$', '')] || 0), 0) / g.docs.length;
          }
          return result;
        });
      }
      if (stage.$sort) {
        const key = Object.keys(stage.$sort)[0];
        const dir = stage.$sort[key];
        data.sort((a, b) => ((a[key] > b[key]) ? dir : -dir));
      }
      if (stage.$limit) {
        data = data.slice(0, stage.$limit);
      }
    }
    return data;
  }
}

// Singleton registry — one instance per collection name
const collections = {};

function getCollection(name) {
  if (!collections[name]) {
    collections[name] = new LocalCollection(name);
  }
  return collections[name];
}

// Seed destinations from mockDestinations.js if the local file is empty
function seedLocalDestinations() {
  const destCollection = getCollection('destinations');
  const existing = destCollection._read();
  if (existing.length === 0) {
    const { MOCK_DESTINATIONS } = require('./src/utils/mockDestinations');
    destCollection._write(MOCK_DESTINATIONS);
    console.log(`📦 Seeded ${MOCK_DESTINATIONS.length} destinations into local database.`);
  } else {
    console.log(`📦 Local database has ${existing.length} destinations.`);
  }
}

// Seed default admin and demo users
async function seedLocalUsers() {
  const bcrypt = require('bcryptjs');
  const userCollection = getCollection('users');
  const existing = userCollection._read();
  
  const adminExists = existing.find(u => u.email === 'admin@voyagex.com');
  const demoExists = existing.find(u => u.email === 'user@voyagex.com');

  if (!adminExists) {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash('admin123', salt);
    userCollection._write([...userCollection._read(), {
      _id: 'admin_user_001',
      firstName: 'Admin',
      lastName: 'VoyageX',
      email: 'admin@voyagex.com',
      password: hashed,
      role: 'admin',
      isActive: true,
      isBlocked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }]);
    console.log('👤 Seeded admin user: admin@voyagex.com / admin123');
  }

  if (!demoExists) {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash('user123', salt);
    userCollection._write([...userCollection._read(), {
      _id: 'demo_user_001',
      firstName: 'Demo',
      lastName: 'User',
      email: 'user@voyagex.com',
      password: hashed,
      role: 'user',
      isActive: true,
      isBlocked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }]);
    console.log('👤 Seeded demo user: user@voyagex.com / user123');
  }
}

module.exports = { LocalCollection, getCollection, seedLocalDestinations, seedLocalUsers };
