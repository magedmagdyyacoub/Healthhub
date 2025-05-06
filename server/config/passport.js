const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const pool = require('./db');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'your_jwt_secret',
};

module.exports = (passport) => {
  // JWT Strategy
  passport.use(
    new JwtStrategy(options, async (payload, done) => {
      try {
        const result = await pool.query('SELECT id, name, email, role FROM users WHERE id = $1', [payload.id]);
        const user = result.rows[0];
        if (!user) return done(null, false);
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    })
  );

  // Google Strategy
  passport.use(new GoogleStrategy({
    clientID: 'GOOGLE_CLIENT_ID',
    clientSecret: 'GOOGLE_CLIENT_SECRET',
    callbackURL: '/api/auth/google/callback',
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      const name = profile.displayName;

      let userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      let user = userResult.rows[0];

      if (!user) {
        const insertResult = await pool.query(
          'INSERT INTO users (name, email, role) VALUES ($1, $2, $3) RETURNING *',
          [name, email, 'user']
        );
        user = insertResult.rows[0];
      }

      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }));

  // Facebook Strategy
  passport.use(new FacebookStrategy({
    clientID: 'FACEBOOK_APP_ID',
    clientSecret: 'FACEBOOK_APP_SECRET',
    callbackURL: '/api/auth/facebook/callback',
    profileFields: ['id', 'emails', 'name', 'displayName']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      const name = profile.displayName;

      let userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      let user = userResult.rows[0];

      if (!user) {
        const insertResult = await pool.query(
          'INSERT INTO users (name, email, role) VALUES ($1, $2, $3) RETURNING *',
          [name, email, 'user']
        );
        user = insertResult.rows[0];
      }

      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }));
};
