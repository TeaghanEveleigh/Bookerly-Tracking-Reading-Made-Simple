export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email and password are required' });
        }

        const emailExists = await checkEmailExists(email);
        if (!emailExists) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const passwordCorrect = await checkPasswordCorrect(email, password);
        if (!passwordCorrect) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const userId = await getUserID(email);
        const token = jwt.sign(
            { id: userId, email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ success: true, token });
    } catch (err) {
        next(err);
    }
};

export const signup = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email and password are required' });
        }

        const emailExists = await checkEmailExists(email);
        if (emailExists) {
            return res.status(409).json({ success: false, error: 'Email already in use' });
        }

        await createUser(email, password);
        const userId = await getUserID(email);

        // Create default libraries for new user
        await Promise.all([
            createUserLibrary(userId, 'Currently Reading'),
            createUserLibrary(userId, 'Want to Read'),
            createUserLibrary(userId, 'Finished Reading'),
        ]);

        const token = jwt.sign(
            { id: userId, email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(201).json({ success: true, token });
    } catch (err) {
        next(err);
    }
};
export const logout = (req, res) => {
    res.json({ success: true });
};

