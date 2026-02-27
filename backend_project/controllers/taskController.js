import Task from "../models/Task.js";
export const createTask = async (req, res) => {
    try {
        const { title, description } = req.body;
        const newTask = new Task({ title, description, createdBy: req.user });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ createdBy: req.user });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.createdBy.toString() !== req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        if (task.createdBy.toString() !== req.user) {
            return res.status(401).json({ message: "Not authorized" });
        }
        await task.deleteOne();
        res.json({ message: "Task removed" });
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

