const Client = require('../models/client.model');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const utils = require('../utils/utils');
const bcrypt = require('bcryptjs');

module.exports.postSignIn = async (req, res, next) => {
    try {
        const { clientEmail, clientPassword } = req.body;

        const client = await Client.findOne({
            clientEmail:clientEmail
        }).lean();

        if (!client) {
            return res.status(403).json({
                message: 'Wrong email or password.'
            });
        }
        const {verifyPassword,createToken} = utils
        const passwordValid = await verifyPassword(
            clientPassword,
            client.clientPassword
        );

        if (passwordValid) {
            const { clientPassword, ...rest } = client;
            
            const clientInfo = Object.assign({}, { ...rest });
            const token = createToken(clientInfo);

            const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
            const expiresAt = decodedToken.exp;

            res.cookie('token',token,{
                httpOnly:true
            });

            res.json({
                message: 'Authentication successful!',
                token,
                clientInfo,
                expiresAt
            });
        } else {
            res.status(403).json({
                message: 'Wrong email or password.'
            });
        }
    } catch (err) {
        console.log(err);
        return res
            .status(400)
            .json({ message: 'Something went wrong.' });
    }
};



module.exports.putSignUp = async (req, res, next) => {
    const { clientName,clientEmail, clientPassword, clientNit} = req.body;
    const {createToken} = utils
    try {
        
        const hashedPassword = await bcrypt.hash(clientPassword, 12)
        const clientData = {
            clientEmail: clientEmail.toLowerCase(),
            clientName,
            clientPassword: hashedPassword,
            clientNit
        };

        const existingEmail = await Client.findOne({
            clientEmail: clientData.clientEmail
        }).lean();

        if (existingEmail) {
            return res
                .status(400)
                .json({ message: 'Email already exists' });
        }

        const newClient = new Client(clientData);
        const savedClient = await newClient.save();
        if (savedClient) {
            const token = createToken(newClient);
            const decodedToken = jwt.verify(token,process.env.SECRET_KEY);
            const expiresAt = decodedToken.exp;

            res.cookie('token',token,{
                httpOnly:true
            });


            const {
                _id,
                clientName,
                clientEmail,
                clientRole,
                clientOrders
            } = savedClient;

            const clientInfo = {
                _id,
                clientName,
                clientEmail,
                clientRole,
                clientOrders
            };

            return res.json({
                message: 'Client created!',
                token,
                clientInfo,
                expiresAt
            });
        } else {
            return res.status(400).json({
                message: 'There was a problem creating your account'
            });
        }
    } catch (err) {
        console.log(err)
        return res.status(400).json({
            message: 'There was a problem creating your account'
        });
    }
}