import express from "express";
import tasksRoutes from './routes/tasks.js'; 
import authRoutes from './routes/auth.js';    

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());

// Routes
app.use('/auth', authRoutes);  
app.use('/', tasksRoutes);     

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong.");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;