const { species, employees, prices, hours } = require('./data');
const data = require('./data');

function getSpeciesByIds(...ids) {
  const result = [];
  ids.forEach((value) => {
    const speciesFilter = species.find((especie) => value === especie.id);
    result.push(speciesFilter);
  });
  return ids === undefined ? [] : result;
}

function getAnimalsOlderThan(animal, age) {
  return species.filter(({ name }) => name === animal)[0].residents
    .every(({ age: idade }) => idade >= age);
}

function getEmployeeByName(employeeName) {
  if (employeeName === undefined) {
    return {};
  }
  return employees
    .find(({ firstName, lastName }) => firstName === employeeName || lastName === employeeName);
}

function createEmployee({ id, firstName, lastName }, { managers, responsibleFor }) {
  return {
    id,
    firstName,
    lastName,
    managers,
    responsibleFor,
  };
}

function isManager(id) {
  return data.employees.some(({ managers: manager }) => manager.includes(id));
}

function addEmployee(id, firstName, lastName, managers = [], responsibleFor = []) {
  const newEmployee = {
    id,
    firstName,
    lastName,
    managers,
    responsibleFor,
  };
  return data.employees.push(newEmployee);
}

function countAnimals(speciesAnimals) {
  if (speciesAnimals) {
    return data.species.find((getName) => getName.name === speciesAnimals).residents.length;
  }
  const contador = data.species.reduce((acc, { name }) => {
    acc[name] = data.species.find((nameSpecie) => nameSpecie.name === name).residents.length;
    return acc;
  }, {});
  return contador;
}

function calculateEntry(entrants) {
  const valor = [];
  if (!entrants || entrants === {}) { return 0; }
  Object.keys(entrants).map((value, index) => {
    if (Object.keys(prices).includes(value)) {
      valor[index] = Object
        .values(entrants)[index] * Object
        .values(prices)[Object.keys(prices).indexOf(value)];
    }
    return valor;
  });
  return valor.reduce((acc, item) => acc + item, 0);
}

function getAnimalMap(options) {
  // seu c??digo aqui
}

function getSchedule(dayName) {
  const dayClosed = { Monday: 'CLOSED' };
  if (dayName === 'Monday') { return dayClosed; }
  const agenda = Object.keys(hours).reduce((acc, item) => {
    acc[item] = `Open from ${data.hours[item].open}am until ${(data.hours[item].close) - 12}pm`;
    return acc;
  }, {});
  Object.assign(agenda, dayClosed);
  const daySelect = Object.keys(agenda).reduce((acc, { dayNamee }) => {
    acc[dayName] = agenda[dayName];
    return acc;
  }, {});
  if (!dayName) {
    return agenda;
  }
  return daySelect;
}

function getOldestFromFirstSpecies(idInput) {
  const findId = employees.find(({ id }) => idInput === id).responsibleFor
    .map((responseId) => species.find((specie) => specie.id === responseId).residents);
  const newArray = findId[0].map(({ age }) => age);
  const maiorIdade = Math.max.apply(null, newArray);
  const valorFinal = findId[0].find(({ age }) => age === maiorIdade);
  const result = [valorFinal.name, valorFinal.sex, valorFinal.age];
  return result;
}
console.log(getOldestFromFirstSpecies('4b40a139-d4dc-4f09-822d-ec25e819a5ad'));

function increasePrices(percentage) {
  const newPrice = Object.keys(prices).reduce((acc, item, index) => {
    acc[item] = parseFloat(((((Object.values(prices))[index] * `1.${percentage}`) + 0.001))
      .toFixed(2));
    return acc;
  }, {});
  Object.assign(prices, newPrice);
  return prices;
}

function getEmployeeCoverage(idOrName) {
  if (!idOrName) {
    const objectReturn = employees.reduce((acc, { firstName, lastName, responsibleFor }) => {
      acc[`${firstName} ${lastName}`] = responsibleFor
        .map((responseId) => species.find((specie) => specie.id === responseId).name);
      return acc;
    }, {});
    return objectReturn;
  }
  const employeeSelected = employees
    .find(({ firstName, lastName, id }) => (
      idOrName === firstName || idOrName === lastName || idOrName === id));
  const employeeResponse = employeeSelected.responsibleFor
    .map((responseId) => species.find((specie) => specie.id === responseId).name);
  const objectEmployeeSelect = employees.reduce((acc) => {
    acc[`${employeeSelected.firstName} ${employeeSelected.lastName}`] = employeeResponse;
    return acc;
  }, {});
  return objectEmployeeSelect;
}

module.exports = {
  calculateEntry,
  getSchedule,
  countAnimals,
  getAnimalMap,
  getSpeciesByIds,
  getEmployeeByName,
  getEmployeeCoverage,
  addEmployee,
  isManager,
  getAnimalsOlderThan,
  getOldestFromFirstSpecies,
  increasePrices,
  createEmployee,
};
