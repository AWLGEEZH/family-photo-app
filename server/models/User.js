const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  profilePicture: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['parent', 'guardian'],
    default: 'parent'
  },
  familyCode: {
    type: String,
    unique: true,
    sparse: true
  },
  familyMembers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  children: [{
    name: {
      type: String,
      required: true
    },
    birthDate: Date,
    profilePicture: String,
    relationship: {
      type: String,
      enum: ['child', 'pet'],
      default: 'child'
    }
  }],
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateFamilyCode = function() {
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  this.familyCode = code;
  return code;
};

module.exports = mongoose.model('User', userSchema);