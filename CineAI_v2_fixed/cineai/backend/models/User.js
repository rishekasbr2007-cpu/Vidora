import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  avatar:   { type: String, default: '' },
  bio:      { type: String, default: '', maxlength: 500 },
  role:     { type: String, enum: ['developer', 'creator', 'both'], default: 'creator' },
  plan:     { type: String, enum: ['free', 'pro', 'studio'], default: 'free' },
  aiCredits: { type: Number, default: 10 },
  creatorSpace: {
    displayName:       { type: String, default: '' },
    handle:            { type: String, default: '', sparse: true },
    banner:            { type: String, default: '' },
    followers:         [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following:         [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    publishedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    totalViews:        { type: Number, default: 0 },
    isVerified:        { type: Boolean, default: false },
  },
  developerSpace: {
    apiKey:       { type: String, default: '' },
    webhookUrl:   { type: String, default: '' },
    apps:         [{ name: String, clientId: String, createdAt: Date }],
    totalApiCalls: { type: Number, default: 0 },
  },
  code: { type: String, default: 'Vidora' },
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  // Auto-set handle and API key on create
  if (!this.creatorSpace) this.creatorSpace = {};
  if (!this.developerSpace) this.developerSpace = {};
  if (this.username) {
    if (!this.creatorSpace.handle) this.creatorSpace.handle = this.username.toLowerCase().replace(/\s+/g,'_');
    if (!this.creatorSpace.displayName) this.creatorSpace.displayName = this.username;
    if (!this.developerSpace.apiKey) this.developerSpace.apiKey = `ck_${this.username}_${Date.now().toString(36)}`;
  }
  next();
});

userSchema.methods.comparePassword = (candidate, hash) => bcrypt.compare(candidate, hash);
userSchema.methods.toPublicJSON = function() {
  const o = this.toObject();
  delete o.password;
  return o;
};

export default mongoose.model('User', userSchema);
