const fetchAllData = async () => {
    const [peopleNoWait] = await Promise.any([
      fetch('https://swapi.dev/api/people/'),]);

    const peopleData = await peopleNoWait.json();
    console.log(peopleData);
  };
  
  fetchAllData();
  