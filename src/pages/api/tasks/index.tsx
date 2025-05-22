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
  res: NextApiResponse<Task | Task[] | { error: string }>
) {
  const db = await dbPromise;
  try {
    switch (req.method) {
      case 'GET':
        const tasks = await db.all('SELECT * FROM tasks');
        return res.status(200).json(tasks);

      case 'POST':
        const { title, description, status = 'pending' } = req.body;

        // Validation
        if (!title || typeof title !== 'string') {
          return res.status(400).json({ error: 'Valid title is required' });
        }
        if (!description || typeof description !== 'string') {
          return res.status(400).json({ error: 'Valid description is required' });
        }
        if (!['pending', 'in-progress', 'completed'].includes(status)) {
          return res.status(400).json({ error: 'Invalid status value' });
        }

        const result = await db.run(
          'INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)',
          title, description, status
        );

        const newTask = await db.get(
          'SELECT * FROM tasks WHERE id = ?',
          result.lastID
        );

        return res.status(201).json(newTask);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}