import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import UserModel from '../models/UserModel';


passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: '/auth/swagger/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user already exists in our db
                const existingUser = await UserModel.findOne({ googleId: profile.id });
                if (existingUser) {
                    return done(null, existingUser);
                }
                // If not, create a new user
                const newUser = await new UserModel({
                    googleId: profile.id,
                    username: profile.displayName,
                    thumbnail: profile._json.picture,
                    role: process.env.READER_ROLE_ID,
                    email: profile.emails && profile.emails[0].value
                }).save();
                done(null, newUser);
            } catch (err) {
                done(err);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((id, done) => {
    UserModel.findById(id)
        .then(user => {
            done(null, user);
        })
        .catch(err => done(err, null));
});

const swaggerMode = {
    passport
}

export default swaggerMode;