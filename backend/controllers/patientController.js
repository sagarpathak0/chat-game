import Patient from '../models/patient.js';

// Get all patients with pagination, filtering and sorting
export const getPatients = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      search = '',
      gender = '',
      ageMin,
      ageMax
    } = req.query;

    // Build filter object
    const filter = {};
    
    // Add search functionality
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { pid: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    // Add gender filter if provided
    if (gender) {
      filter.gender = gender;
    }

    // Add age range filter if provided
    if (ageMin !== undefined || ageMax !== undefined) {
      filter.age = {};
      if (ageMin !== undefined) filter.age.$gte = parseInt(ageMin);
      if (ageMax !== undefined) filter.age.$lte = parseInt(ageMax);
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Convert page and limit to numbers
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Execute query with pagination
    const patients = await Patient.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNumber);

    // Get total count for pagination
    const totalPatients = await Patient.countDocuments(filter);

    return res.status(200).json({
      patients,
      totalPages: Math.ceil(totalPatients / limitNumber),
      currentPage: pageNumber,
      totalPatients
    });
  } catch (error) {
    console.error('Error getting patients:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get patient by ID
export const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findById(id);
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    return res.status(200).json(patient);
  } catch (error) {
    console.error('Error getting patient:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get patient by PID (Patient ID)
export const getPatientByPid = async (req, res) => {
  try {
    const { pid } = req.params;
    const patient = await Patient.findOne({ pid });
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    return res.status(200).json(patient);
  } catch (error) {
    console.error('Error getting patient:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Create a new patient
export const createPatient = async (req, res) => {
  try {
    const { pid, name, age, gender, phone, address, city, email, medications } = req.body;

    // Check if patient with same PID already exists
    const existingPatient = await Patient.findOne({ pid }).maxTimeMS(20000); // Increase operation timeout
    if (existingPatient) {
      return res.status(400).json({ message: 'Patient with this ID already exists' });
    }

    const newPatient = new Patient({
      pid,
      name,
      age,
      gender,
      phone,
      address,
      city,
      email,
      medications: medications || [],
      history: [],
      tests: []
    });

    await newPatient.save();
    return res.status(201).json({ 
      message: 'Patient created successfully',
      patient: newPatient
    });
  } catch (error) {
    console.error('Error creating patient:', error);
    
    // Provide more specific error messages based on error type
    if (error.name === 'MongooseError' && error.message.includes('buffering timed out')) {
      return res.status(503).json({ 
        message: 'Database connection timed out. Please try again later.',
        error: error.message
      });
    }
    
    return res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Update a patient
export const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Add updatedAt timestamp
    updates.updatedAt = new Date();

    const patient = await Patient.findByIdAndUpdate(
      id, 
      updates, 
      { new: true, runValidators: true }
    );
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    return res.status(200).json({ 
      message: 'Patient updated successfully',
      patient
    });
  } catch (error) {
    console.error('Error updating patient:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Add medication to patient
export const addMedication = async (req, res) => {
  try {
    const { id } = req.params;
    const medication = req.body;
    
    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    patient.medications.push(medication);
    patient.updatedAt = new Date();
    
    await patient.save();
    
    return res.status(200).json({
      message: 'Medication added successfully',
      patient
    });
  } catch (error) {
    console.error('Error adding medication:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Delete a patient
export const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findByIdAndDelete(id);
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    return res.status(200).json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Error deleting patient:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
