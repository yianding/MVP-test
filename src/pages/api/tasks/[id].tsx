import type { NextApiRequest, NextApiResponse } from 'next';
import { dbPromise } from '../../../lib/db';

type Task = {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
  updatedAt: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Task | { error: string }>
) {
  const db = await dbPromise;
  const taskId = Number(req.query.id);

  if (isNaN(taskId)) {
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  try {
    switch (req.method) {
      case 'GET':
        const task = await db.get(
          'SELECT * FROM tasks WHERE id = ?',
          taskId
        );
        
        if (!task) {
          return res.status(404).json({ error: 'Task not found' });
        }
        
        return res.status(200).json(task);

      case 'PUT':
        const { title, description, status } = req.body;
        const currentTask = await db.get(
          'SELECT * FROM tasks WHERE id = ?',
          taskId
        );

        if (!currentTask) {
          return res.status(404).json({ error: 'Task not found' });
        }

        // Validation
        if (title && typeof title !== 'string') {
          return res.status(400).json({ error: 'Title must be a string' });
        }
        if (description && typeof description !== 'string') {
          return res.status(400).json({ error: 'Description must be a string' });
        }
        if (status && !['pending', 'in-progress', 'completed'].includes(status)) {
          return res.status(400).json({ error: 'Invalid status value' });
        }

        await db.run(
          `UPDATE tasks 
           SET title = ?, description = ?, status = ?, updatedAt = datetime('now')
           WHERE id = ?`,
          title || currentTask.title,
          description || currentTask.description,
          status || currentTask.status,
          taskId
        );

        const updatedTask = await db.get(
          'SELECT * FROM tasks WHERE id = ?',
          taskId
        );

        return res.status(200).json(updatedTask);

      case 'DELETE':
        const deleteResult = await db.run(
          'DELETE FROM tasks WHERE id = ?',
          taskId
        );

        if (deleteResult.changes === 0) {
          return res.status(404).json({ error: 'Task not found' });
        }

        return res.status(204).end();

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}



