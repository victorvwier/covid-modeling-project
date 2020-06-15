import { getRandomIntExceptForValue } from './util';
import RelocationInfo from './data/relocationInfo';
import Stats from './data/stats';
import { TYPES } from './CONSTANTS';

/** @class RelocationUtil handling relocating people. */
export default class RelocationUtil {
  /**
   * Instantiates an Object to keep track of relocations.
   *
   * @param {Model} model The model in which to keep track of relocations.
   */
  constructor(model) {
    this.model = model;
    this.relocations = [];

    // DEBUG
    window.relocationUtil = this;
  }

  /**
   * A function to handle a step of all current relocations in the model.
   */
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

  /**
   * A function handling a person starting to relocate.
   *
   * @param {Person} person The person to start relocating.
   */
  insertRelocation(person) {
    // Pause
    this.model.pauseExecution();
    // Move person

    const sourceId = person.communityId;
    // Get models which very high density and exclude them from models being relocated to

    // TODO now we're not using this (find a way to do it)
    // const maxTotalPopulation = Math.round(
    //   (this.model.stats.sum() / this.model.numCommunities) * 1.5
    // );
    // const exclude = Object.values(this.model.communities)
    //   .filter((mod) => mod.totalPopulation > maxTotalPopulation)
    //   .map((mod) => mod.id)
    //   .concat([sourceId]);
    // // Destination Id

    // Only exclude the source if there are more than one community
    const excludedIds = this.model.numCommunities > 1 ? [sourceId] : [];
    const destId = getRandomIntExceptForValue(
      0,
      this.model.numCommunities - 1,
      excludedIds
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

  /**
   * A function to remove the RelocationInfo from the ones we are tracking.
   *
   * @param {RelocationInfo} relocationInfo The relocationInfo to remove.
   *
   * @throws When no element is removed from tracked relocations.
   */
  _removeRelocationInfo(relocationInfo) {
    const lengthBefore = this.relocations.length;
    this.relocations = this.relocations.filter((rel) => rel !== relocationInfo);
    if (lengthBefore !== this.relocations.length + 1) {
      throw Error(
        'Tried to remove a relocation info but nothing was removed???'
      );
    }
  }

  /**
   * A function to cancel all ongoing relocations if the model is reset by the user
   */
  clearAllRelocationsForReset() {
    this.relocations = [];
  }

  /**
   * A function to get the stats of all relocating people.
   *
   * @returns {Stats} The stats of all combined relocating people.
   *
   * @throws If a person of an invalid type is found.
   */
  getStats() {
    const stats = new Stats(0, 0, 0, 0, 0, 0);
    this.relocations.forEach(({ person }) => {
      if(person.inIcu) {
        stats.icu++;
      }
      
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
