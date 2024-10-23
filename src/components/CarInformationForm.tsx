import React, { useMemo } from 'react';
import { useStore } from '@/store/store';
import Select, { SingleValue } from 'react-select';
import Lottie from 'lottie-react';
import carAnimation from '@/lotties/car.json'; // You'll need to add this file

// Comprehensive list of car makes and models
const carData = {
  "Acura": ["ILX", "MDX", "RDX", "TLX", "NSX", "Integra"],
  "Alfa Romeo": ["Giulia", "Stelvio", "Tonale"],
  "Aston Martin": ["DB11", "DBS", "DBX", "Vantage"],
  "Audi": ["A3", "A4", "A5", "A6", "A7", "A8", "Q3", "Q4 e-tron", "Q5", "Q7", "Q8", "e-tron", "e-tron GT", "TT", "R8"],
  "Bentley": ["Bentayga", "Continental GT", "Flying Spur"],
  "BMW": ["2 Series", "3 Series", "4 Series", "5 Series", "7 Series", "8 Series", "X1", "X2", "X3", "X4", "X5", "X6", "X7", "Z4", "i3", "i4", "i7", "iX"],
  "Buick": ["Enclave", "Encore", "Encore GX", "Envision"],
  "Cadillac": ["CT4", "CT5", "Escalade", "XT4", "XT5", "XT6", "LYRIQ"],
  "Chevrolet": ["Spark", "Sonic", "Malibu", "Camaro", "Corvette", "Trax", "Trailblazer", "Equinox", "Blazer", "Traverse", "Tahoe", "Suburban", "Colorado", "Silverado", "Bolt EV", "Bolt EUV"],
  "Chrysler": ["300", "Pacifica", "Voyager"],
  "Dodge": ["Challenger", "Charger", "Durango", "Hornet"],
  "Ferrari": ["Roma", "Portofino", "SF90 Stradale", "F8 Tributo", "812 Superfast"],
  "Fiat": ["500X"],
  "Ford": ["EcoSport", "Escape", "Bronco Sport", "Edge", "Explorer", "Expedition", "Ranger", "F-150", "Bronco", "Mustang", "Mustang Mach-E", "Maverick"],
  "Genesis": ["G70", "G80", "G90", "GV60", "GV70", "GV80"],
  "GMC": ["Terrain", "Acadia", "Yukon", "Canyon", "Sierra"],
  "Honda": ["Civic", "Accord", "Insight", "HR-V", "CR-V", "Pilot", "Passport", "Odyssey", "Ridgeline"],
  "Hyundai": ["Accent", "Elantra", "Sonata", "Veloster", "Venue", "Kona", "Tucson", "Santa Fe", "Palisade", "IONIQ", "NEXO"],
  "Infiniti": ["Q50", "Q60", "QX50", "QX55", "QX60", "QX80"],
  "Jaguar": ["XE", "XF", "F-TYPE", "E-PACE", "F-PACE", "I-PACE"],
  "Jeep": ["Renegade", "Compass", "Cherokee", "Grand Cherokee", "Wrangler", "Gladiator", "Wagoneer", "Grand Wagoneer"],
  "Kia": ["Rio", "Forte", "K5", "Stinger", "Soul", "Seltos", "Sportage", "Sorento", "Telluride", "Carnival", "Niro", "EV6"],
  "Lamborghini": ["Urus", "Huracan", "Aventador"],
  "Land Rover": ["Discovery Sport", "Discovery", "Range Rover Evoque", "Range Rover Velar", "Range Rover Sport", "Range Rover", "Defender"],
  "Lexus": ["IS", "ES", "LS", "RC", "LC", "UX", "NX", "RX", "GX", "LX"],
  "Lincoln": ["Corsair", "Nautilus", "Aviator", "Navigator"],
  "Lucid": ["Air"],
  "Maserati": ["Ghibli", "Quattroporte", "Levante", "MC20"],
  "Mazda": ["Mazda3", "Mazda6", "CX-3", "CX-30", "CX-5", "CX-50", "CX-9", "MX-5 Miata"],
  "McLaren": ["570S", "720S", "Artura", "GT"],
  "Mercedes-Benz": ["A-Class", "C-Class", "E-Class", "S-Class", "GLA", "GLB", "GLC", "GLE", "GLS", "G-Class", "EQS", "EQE"],
  "MINI": ["Hardtop", "Clubman", "Countryman", "Convertible"],
  "Mitsubishi": ["Mirage", "Outlander Sport", "Outlander", "Eclipse Cross"],
  "Nissan": ["Versa", "Sentra", "Altima", "Maxima", "Leaf", "Kicks", "Rogue", "Murano", "Pathfinder", "Armada", "Frontier", "Titan", "Z", "Ariya"],
  "Porsche": ["718 Boxster", "718 Cayman", "911", "Panamera", "Macan", "Cayenne", "Taycan"],
  "Ram": ["1500", "2500", "3500", "ProMaster"],
  "Rivian": ["R1T", "R1S"],
  "Rolls-Royce": ["Ghost", "Phantom", "Cullinan", "Wraith", "Dawn"],
  "Subaru": ["Impreza", "Legacy", "WRX", "BRZ", "Crosstrek", "Forester", "Outback", "Ascent", "Solterra"],
  "Tesla": ["Model 3", "Model S", "Model X", "Model Y"],
  "Toyota": ["Corolla", "Camry", "Avalon", "Prius", "C-HR", "RAV4", "Venza", "Highlander", "4Runner", "Sequoia", "Tacoma", "Tundra", "Sienna", "bZ4X"],
  "Volkswagen": ["Jetta", "Passat", "Arteon", "Golf GTI", "Golf R", "Taos", "Tiguan", "Atlas", "Atlas Cross Sport", "ID.4"],
  "Volvo": ["S60", "S90", "V60", "V90", "XC40", "XC60", "XC90", "C40"]
};

const CarInformationForm: React.FC = () => {
  const { carMake, setCarMake, carModel, setCarModel, carYear, setCarYear, carColor, setCarColor } = useStore();

  const makeOptions = useMemo(() => 
    Object.keys(carData).map(make => ({ value: make, label: make })),
    []
  );

  const modelOptions = useMemo(() => 
    carMake ? carData[carMake as keyof typeof carData].map(model => ({ value: model, label: model })) : [],
    [carMake]
  );

  const yearOptions = useMemo(() => 
    Array.from({ length: 30 }, (_, i) => {
      const year = new Date().getFullYear() - i;
      return { value: year.toString(), label: year.toString() };
    }),
    []
  );

  const colorOptions = [
    { value: 'black', label: 'Black' },
    { value: 'white', label: 'White' },
    { value: 'silver', label: 'Silver' },
    { value: 'gray', label: 'Gray' },
    { value: 'red', label: 'Red' },
    { value: 'blue', label: 'Blue' },
    { value: 'green', label: 'Green' },
    { value: 'yellow', label: 'Yellow' },
    { value: 'orange', label: 'Orange' },
    { value: 'brown', label: 'Brown' },
    { value: 'purple', label: 'Purple' },
    { value: 'gold', label: 'Gold' },
  ];


  console.log(makeOptions, modelOptions, yearOptions, colorOptions)

  const handleMakeChange = (selectedOption: SingleValue<{ value: string; label: string }> | null) => {
    const newMake = selectedOption?.value || '';
    if (newMake !== carMake) {
      setCarMake(newMake);
      setCarModel('');
      setCarYear('');
      setCarColor('');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      
      <div className="text-center mb-[-140px] mt-[-40px] ">
        <div className="w-72 h-72 mx-auto">
          <Lottie animationData={carAnimation} loop={true} />
        </div>
      </div>

      <Select
        value={makeOptions.find(option => option.value === carMake)}
        onChange={handleMakeChange}
        options={makeOptions}
        placeholder="Select Car Make"
        className="mb-4"
      />
      <Select
        value={carModel ? modelOptions.find(option => option.value === carModel) : null}
        onChange={(selectedOption: SingleValue<{ value: string; label: string }> | null) => 
          setCarModel(selectedOption?.value || '')
        }
        options={modelOptions}
        placeholder="Select Car Model"
        className="mb-4"
        isDisabled={!carMake}
      />
      <Select
        value={carYear ? yearOptions.find(option => option.value === carYear) : null}
        onChange={(selectedOption: SingleValue<{ value: string; label: string }> | null) => 
          setCarYear(selectedOption?.value || '')
        }
        options={yearOptions}
        placeholder="Select Car Year"
        className="mb-4"
      />
      <Select
        value={carColor ? colorOptions.find(option => option.value === carColor) : null}
        onChange={(selectedOption: SingleValue<{ value: string; label: string }> | null) => 
          setCarColor(selectedOption?.value || '')
        }
        options={colorOptions}
        placeholder="Select Car Color"
        className="mb-4"
      />
    </div>
  );
};

export default CarInformationForm;
