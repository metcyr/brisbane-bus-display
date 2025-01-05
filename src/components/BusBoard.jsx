import React, { useState, useEffect } from 'react';

const CHERMSIDE_WEST_ROUTES = [
  { route: '346', destination: 'City via Stafford' },
  { route: '346', destination: 'Chermside West via Stafford' },
  { route: '390', destination: 'City via Gympie Road' },
  { route: '390', destination: 'Chermside West via Gympie Road' }
];

function BusBoard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [busServices, setBusServices] = useState([]);

  const generateNextBuses = () => {
    const now = new Date();
    const services = [];
    
    const numServices = Math.floor(Math.random() * 3) + 2;
    const shuffledRoutes = [...CHERMSIDE_WEST_ROUTES]
      .sort(() => 0.5 - Math.random())
      .slice(0, numServices);

    shuffledRoutes.forEach((routeInfo, index) => {
      const minMinutes = index * 7 + 3;
      const maxMinutes = minMinutes + 15;
      const minutesUntilArrival = 
        Math.floor(Math.random() * (maxMinutes - minMinutes)) + minMinutes;
      
      const arrivalTime = new Date(now.getTime() + minutesUntilArrival * 60000);
      
      services.push({
        ...routeInfo,
        expectedTime: arrivalTime,
        minutesAway: minutesUntilArrival
      });
    });

    return services.sort((a, b) => a.minutesAway - b.minutesAway);
  };

  useEffect(() => {
    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Update bus times every 30 seconds
    const busInterval = setInterval(() => {
      setBusServices(generateNextBuses());
    }, 30000);

    // Initial bus times
    setBusServices(generateNextBuses());

    return () => {
      clearInterval(timeInterval);
      clearInterval(busInterval);
    };
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-AU', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <div style={{ 
      backgroundColor: 'black',
      minHeight: '100vh',
      color: 'white',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <div style={{
          backgroundColor: '#0747a6',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <div style={{
            fontSize: '24px',
            fontWeight: 'bold'
          }}>
            Maundrell Tce at Kinnerton Street
          </div>
          <div>Stop 003994 (Zone 2)</div>
        </div>

        {busServices.map((service, index) => (
          <div key={index} style={{
            backgroundColor: '#1a1a1a',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '15px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <div style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#ffff00',
              minWidth: '80px'
            }}>
              {service.route}
            </div>
            <div style={{
              flexGrow: 1,
              padding: '0 20px',
              fontSize: '20px'
            }}>
              {service.destination}
            </div>
            <div style={{textAlign: 'right'}}>
              <div style={{
                fontSize: '24px',
                color: '#00ff00'
              }}>
                {formatTime(service.expectedTime)}
              </div>
              <div style={{
                fontSize: '18px',
                color: '#888'
              }}>
                {service.minutesAway} mins
              </div>
            </div>
          </div>
        ))}

        <div style={{
          textAlign: 'center',
          color: '#666',
          fontSize: '14px',
          marginTop: '20px'
        }}>
          Last updated: {formatTime(currentTime)}
        </div>
      </div>
    </div>
  );
}

export default BusBoard;