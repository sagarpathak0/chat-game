import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

interface Patient {
  _id: string;
  pid: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
  }>;
}

interface PatientsResponse {
  patients: Patient[];
  totalPages: number;
  currentPage: number;
  totalPatients: number;
}

const PatientTable: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const router = useRouter();

  const fetchPatients = async (page: number = 1, searchTerm: string = '') => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const response = await axios.get<PatientsResponse>(
        `https://chat-game-ten.vercel.app/api/patients?page=${page}&search=${searchTerm}`,
        {
          headers: {
            'x-auth-token': token
          }
        }
      );

      setPatients(response.data.patients);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
      setError(null);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Failed to fetch patients');
      } else {
        setError('An error occurred while fetching patients');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients(currentPage, search);
  }, [currentPage, search, router]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    fetchPatients(1, search);
  };

  const handleViewPatient = (id: string) => {
    router.push(`/patients/${id}`);
  };

  if (loading && patients.length === 0) {
    return <div className="p-4 text-center">Loading patients...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Patient List</h2>
      
      <form onSubmit={handleSearch} className="mb-4 flex">
        <input
          type="text"
          placeholder="Search patients..."
          className="px-4 py-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
        >
          Search
        </button>
      </form>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="py-3 px-4 text-left">PID</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Age</th>
              <th className="py-3 px-4 text-left">Gender</th>
              <th className="py-3 px-4 text-left">Phone</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Medications</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            {patients.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-4 px-4 text-center">No patients found</td>
              </tr>
            ) : (
              patients.map((patient) => (
                <tr key={patient._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{patient.pid}</td>
                  <td className="py-3 px-4">{patient.name}</td>
                  <td className="py-3 px-4">{patient.age}</td>
                  <td className="py-3 px-4">{patient.gender}</td>
                  <td className="py-3 px-4">{patient.phone}</td>
                  <td className="py-3 px-4">{patient.email}</td>
                  <td className="py-3 px-4">
                    {patient.medications.length > 0 
                      ? patient.medications.map(med => med.name).join(', ')
                      : 'None'}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleViewPatient(patient._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded-l disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-1 bg-gray-100">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded-r disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PatientTable;
