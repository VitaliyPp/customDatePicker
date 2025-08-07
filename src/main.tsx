import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { DatePicker } from '@/lib';

const App = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [ageRestriction, setAgeRestriction] = useState(false);

  return (
    <div>
      <DatePicker value={selectedDate} onChange={setSelectedDate} ageRestriction={ageRestriction} />
      <p>Selected Date: {selectedDate ? selectedDate.toDateString() : 'None'}</p>
      <div>
        <input
          type="checkbox"
          id="ageRestriction"
          checked={ageRestriction}
          onChange={(e) => setAgeRestriction(e.target.checked)}
        />
        <label htmlFor="ageRestriction">Enable Age Restriction (18-100 years)</label>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
