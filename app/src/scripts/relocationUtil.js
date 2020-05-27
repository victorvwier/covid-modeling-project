import { getRandomIntExceptForValue } from './util';
import { TYPES } from './CONSTANTS';
import RelocationInfo from './data/relocationInfo';
import Stats from './data/stats';

export default class RelocationUtil {
  constructor(model) {
    this.model = model;
    this.relocations = [];

    // DEBUG
    window.relocationUtil = this;
  }

  handleAllRelocations() {
    for (let i = 0; i < this.relocations.length; i++) {
      const relocation = this.relocations[i];
      relocation.takeStep();
      if (relocation.hasArrived()) {
        this.model.pauseExecution();

        relocation.person.relocating = false;
        this.model.communities[relocation.destId].handlePersonJoining(
          relocation.person
        );
        this._removeRelocationInfo(relocation);

        this.model.resumeExecution();
      }
    }
  }

  insertRelocation(person) {
    console.log('He watned to relocate');
    // Pause
    this.model.pauseExecution();
    // Move person
    const sourceId = person.communityId;
    // Get community with very high density and exclude them from models being relocated to
    const maxTotalPopulation = Math.round(
      (this.model.stats.sum() / this.model.numCommunities) * 1.5
    );
    const exclude = Object.values(this.model.communities)
      .filter((mod) => mod.totalPopulation > maxTotalPopulation)
      .map((mod) => mod.id)
      .concat([sourceId]);
    // Destination Id
    const destId = getRandomIntExceptForValue(
      0,
      this.model.numCommunities - 1,
      exclude
    );
    this.model.communities[sourceId].handlePersonLeaving(person);
    // Change communityId of person
    person.communityId = destId;
    const distCoords = this.model.communities[destId].getRandomPoint();

    // Do it via this
    this.relocations.push(new RelocationInfo(person, distCoords, destId));
    // Resume
    this.model.resumeExecution();
  }

  _removeRelocationInfo(relocationInfo) {
    const lengthBefore = this.relocations.length;
    this.relocations = this.relocations.filter((rel) => rel !== relocationInfo);
    if (lengthBefore !== this.relocations.length + 1) {
      throw Error(
        'Tried to remove a relocation info but nothing was removed???'
      );
    }
  }

  getStats() {
    const stats = new Stats(0, 0, 0, 0, 0);
    this.relocations.forEach(({ person }) => {
      switch (person.type) {
        case TYPES.SUSCEPTIBLE:
          stats.susceptible++;
          break;
        case TYPES.NONINFECTIOUS:
          stats.noninfectious++;
          break;
        case TYPES.INFECTIOUS:
          stats.infectious++;
          break;
        case TYPES.IMMUNE:
          stats.immune++;
          break;
        case TYPES.DEAD:
          stats.dead++;
          break;
        default:
          throw Error('Unknown type');
      }
    });
    return stats;
  }
}
