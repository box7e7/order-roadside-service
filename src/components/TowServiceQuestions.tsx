import React, { useState } from 'react';
import { useStore } from '@/store/store';

const TowServiceQuestions: React.FC = () => {
  const { service, towQuestions, setTowQuestions } = useStore();
  const [specialNotes, setSpecialNotes] = useState('');

  const renderQuestion = (question: keyof typeof towQuestions, text: string) => (
    <div className="mb-4">
      <p className="mb-2">{text}</p>
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setTowQuestions({ ...towQuestions, [question]: true })}
          className={`px-4 py-2 rounded ${towQuestions[question] === true ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
        >
          Yes
        </button>
        <button
          onClick={() => setTowQuestions({ ...towQuestions, [question]: false })}
          className={`px-4 py-2 rounded ${towQuestions[question] === false ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
        >
          No
        </button>
      </div>
    </div>
  );

  const handleLocationTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTowQuestions({ ...towQuestions, locationType: e.target.value });
  };

  const handleSpecialNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSpecialNotes(e.target.value);
    setTowQuestions({ ...towQuestions, specialNotes: e.target.value });
  };

  const renderTowQuestions = () => (
    <>
      {renderQuestion('accident', 'Has your vehicle been involved in an accident?')}
      {renderQuestion('brokenAxle', 'Is the axle broken?')}
      {renderQuestion('wheelsIntact', 'Are all wheels intact?')}
      {renderQuestion('unattended', 'Is the vehicle unattended?')}
      {renderQuestion('keyWithVehicle', 'Is the key with the vehicle?')}
      {renderQuestion('canPutInNeutral', 'Can the vehicle be put in neutral?')}
    </>
  );

  const renderTireQuestions = () => (
    <>
      {renderQuestion('hasWorkingSpare', 'Do you have a good working spare tire?')}
      {renderQuestion('hasWheelLockKey', 'Do you have the wheel lock key?')}
      {renderQuestion('areLugnutsStripped', 'Are the lugnuts stripped?')}
    </>
  );

  return (
    <div className="w-full">
      {(service === 'tow' || service === 'winch out') && renderTowQuestions()}
      {service === 'tire' && renderTireQuestions()}
      
      <div className="mt-6">
        <label htmlFor="locationType" className="block mb-2 font-medium text-gray-700">
          Location Type
        </label>
        <div className="relative">
          <select
            id="locationType"
            value={towQuestions.locationType || ''}
            onChange={handleLocationTypeChange}
            className="block w-full px-4 py-3 pr-8 leading-tight text-gray-700 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="">Select a location type</option>
            <option value="Highway">Highway</option>
            <option value="Home Driveway">Home Driveway</option>
            <option value="Home Garage">Home Garage</option>
            <option value="Parking Garage">Parking Garage</option>
            <option value="Parking Lot">Parking Lot</option>
          </select>
          {/* ... (SVG for dropdown arrow) */}
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="specialNotes" className="block mb-2 font-medium">
          Special Notes or Instructions (optional):
        </label>
        <textarea
          id="specialNotes"
          value={specialNotes}
          onChange={handleSpecialNotesChange}
          className="w-full p-2 border rounded-md"
          rows={4}
          placeholder="Enter any additional information or special instructions for the service..."
        />
      </div>
    </div>
  );
};

export default TowServiceQuestions;
