import express from 'express';
import pg from 'pg'; 
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt';

export function authenticateToken (req, res, next) {
    const authHeader = req.headers['authorization']; 
    const token = authHeader && authHeader.split ('')[1];

    if (!token){
        return res.status(401).json({error: 'Access token needed'})
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded; 

        next(); }
        catch (error) {
            return res.status(403). json({error: 'invalid token'});
        }
    }
