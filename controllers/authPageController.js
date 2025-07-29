
const Joi = require('joi'); // use a validation library
const bcrypt = require('bcrypt');
const db = require('../db');
const jwt = require('jsonwebtoken');



exports.registrationPageContent = (req, res) => {
    res.render('auth/registrationPageContent' );
};


exports.processRegistration = async (req, res) => {


    // Simple validation rules using Joi library
    const schema = Joi.object({
        firstName: Joi.string().min(1).required(),
        lastName: Joi.string().min(1).required(),
        email: Joi.string().email().required(),

        // confirm email match
        confirmEmail: Joi.string().valid(Joi.ref('email')).required().messages({
            'any.only': 'Email addresses must match'
        }),

        // confirm password match
        password: Joi.string().min(8).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
            'any.only': 'Passwords must match'
        })
    });

    try {
        // Validate input
        const { error, value } = schema.validate(req.body);
        
        if (error) {
            return res.send(`
                <div class="alert alert-danger">
                    <strong>Error:</strong> ${error.details[0].message}
                </div>
            `);
        }

        const { firstName, lastName, email, password } = value;

        // Check if user exists
        const existingUser = await db.query('SELECT id FROM users WHERE email = $1', [email]);
        
        if (existingUser.rows.length > 0) {
            return res.send(`
                <div class="alert alert-warning">
                    <strong>Email already registered!</strong> Please use a different email.
                </div>
            `);
        }

        // Hash password and create user
        const hashedPassword = await bcrypt.hash(password, 12);
        
        await db.query(
            'INSERT INTO users (first_name, last_name, email, password_hash) VALUES ($1, $2, $3, $4)',
            [firstName, lastName, email, hashedPassword]
        );

        // Success - render login page with success message
        res.render('auth/loginPageContent', { 
            successMessage: 'Registration successful! Please login with your new credentials.' 
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.send(`
            <div class="alert alert-danger">
                <strong>Error:</strong> Registration failed. Please try again.
            </div>
        `);
    }
};



exports.loginPageContent = (req, res) => {
    res.render('auth/loginPageContent', {});
};


exports.processLogin = async (req, res) => {

    
    try {
        const { email, password } = req.body;

        // Simple validation
        if (!email || !password) {
            return res.status(400).send(`
                <div class="alert alert-danger">
                    <strong>Error:</strong> Email and password are required.
                </div>
            `);
        }

        // Find user by email (since email is username)
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(401).send(`
                <div class="alert alert-danger">
                    <strong>Access Denied:</strong> Invalid credentials.
                </div>
            `);
        }

        const user = result.rows[0];

        // Check if account is locked


        // Compare password
        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {


            // Log failed login attempt
            await db.query(
                `INSERT INTO login_history (user_id, login_successful, ip_address, user_agent, failure_reason) 
                 VALUES ($1, $2, $3, $4, $5)`,
                [user.id, false, req.ip || '127.0.0.1', req.get('User-Agent') || 'Unknown', 'invalid_password']
            );

            return res.status(401).send(`
                <div class="alert alert-danger">
                    <strong>Access Denied:</strong> Invalid credentials.
                </div>
            `);
        }


        // Log successful login
        await db.query(
            `INSERT INTO login_history (user_id, login_successful, ip_address, user_agent, login_method) 
             VALUES ($1, $2, $3, $4, $5)`,
            [user.id, true, req.ip || '127.0.0.1', req.get('User-Agent') || 'Unknown', 'email_password']
        );

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user.id, 
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Set secure cookie
        res.cookie('token', token, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        // Send HTMX redirect header
        res.set('HX-Redirect', '/dashboard');
        res.send('Success'); // HTMX needs some response

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send(`
            <div class="alert alert-danger">
                <strong>System Error:</strong> Authentication failed. Please try again.
            </div>
        `);
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
};