const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: String,
    amount: Number,
    createdAt: Date,
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      index: true,
    },
    email: {
      type: String,
      index: true,
    },
    phone: String,
    city: {
      type: String,
      index: true,
    },
    age: {
      type: Number,
      index: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    // Address
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zip: String,
    },

    // Employment
    employment: {
      company: String,
      department: String,
      designation: String,
      salary: Number,
    },

    // Preferences
    preferences: {
      language: String,
      notifications: Boolean,
      darkMode: Boolean,
    },

    // Orders
    orders: [orderSchema],

    // CPU intensive hash
    hash: String,

    // Large text
    bio: String,

    // Compressed binary data
    compressedData: Buffer,
  },
  {
    timestamps: false,
  }
);

// ---------- Indexes ----------
userSchema.index({ email: 1 });
userSchema.index({ city: 1 });
userSchema.index({ age: 1 });
userSchema.index({ createdAt: -1 });

// Compound indexes
userSchema.index({ city: 1, age: 1 });
userSchema.index({ city: 1, createdAt: -1 });

// Nested indexes
userSchema.index({ "employment.company": 1 });
userSchema.index({ "employment.department": 1 });
userSchema.index({ "preferences.language": 1 });
userSchema.index({ "orders.orderId": 1 });

module.exports = mongoose.model("User", userSchema);