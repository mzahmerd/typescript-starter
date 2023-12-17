import { body } from 'express-validator';

const mainRequirement = {
    login: [
        body('username').isString(),
        body('password').isString().isLength({ min: 5 })
    ],

    signup: [
        body('email').isEmail().optional(),
        body('password').isString().isLength({ min: 5 }),
        body('phoneNumber').isString().isLength({ min: 11, max: 13 }),
        body('firstName').isString().isLength({ min: 1 }),
        body('lastName').isString().optional({ nullable: true })
    ]
};

export default mainRequirement;
