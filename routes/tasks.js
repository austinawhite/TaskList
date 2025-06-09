import express from 'express'; 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getTaskById, getAllTasks, getTasksByUserId, createTask, updateTask, deleteTask } from '#db/queries/tasks';
import { authenticateToken } from '#middlewear';

const router = express.Router();

// post tasks router - creates a new task by the logged-in user 

router.post('/tasks', authenticateToken, async (req, res) => {
  try {
    const { title, done } = req.body;
    const userId = req.user.id;

    // Validation - both title and done status are required
    if (!title) {
      return res.status(400).json({ error: 'Task title is required' });
    }
    
    if (typeof done !== 'boolean') {
      return res.status(400).json({ error: 'Done status must be true or false' });
    }

    const newTask = await createTask({
      title,
      done,
      userId
    });

    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});


// get tasks - sends all tasks owned by a logged in user 

router.get('/tasks', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const tasks = await getTasksByUserId(userId);
    
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});



// put tasks:id - to update a specific task - send 400 error if all info not included, 403 error if the task is owned by someone else 

router.put('/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;
    const { title, description, priority, dueDate, completed } = req.body;

    // Check if required fields are provided
    if (!title && !description && priority === undefined && !dueDate && completed === undefined) {
      return res.status(400).json({ error: 'At least one field must be provided to update' });
    }

    // Check if task exists and get current task
    const existingTask = await getTaskById(taskId);
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check if user owns the task
    if (existingTask.userId !== userId) {
      return res.status(403).json({ error: 'You can only update your own tasks' });
    }

    // Update the task
    const updatedTask = await updateTask(taskId, {
      title: title || existingTask.title,
      done: done || existingTask.done,
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});



// delete tasks/:id - deletes a specific task owned by the user - should have a 403 error if the user does no own the task 

router.delete('/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;

    // Check if task exists and get current task
    const existingTask = await getTaskById(taskId);
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check if user owns the task
    if (existingTask.userId !== userId) {
      return res.status(403).json({ error: 'You can only delete your own tasks' });
    }

    // Delete the task
    await deleteTask(taskId);
    
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router;