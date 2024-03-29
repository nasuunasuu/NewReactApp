import React from 'react';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import jaLocale from '@fullcalendar/core/locales/ja';

const MainScreen = ({ setActivePage, setDate }) => {

  const renderDayCellContent = (arg) => {
    const year = arg.date.getFullYear();
    const month = (arg.date.getMonth() + 1).toString().padStart(2, '0');
    const day = arg.date.getDate().toString().padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    return (
      <div>
        {arg.dayNumberText}
        <button onClick={() => { setDate(dateStr); setActivePage('sub'); }}>click</button>
      </div>
    );
  };

  return (
    <div>
      <h1>ここはメイン画面です</h1>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
        initialView="dayGridMonth"
        locales={[jaLocale]}
        locale='ja'
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: '',
        }}
        events={[
          {title:'eventを', start: '2024-03-14'},
          {title:'こんな感じで追加できます', start: '2024-03-15', end: '2024-03-17'}
        ]}
        dayCellContent={renderDayCellContent}
      />
    </div>
  );
};

export default MainScreen;
