import { getRandomIntExceptForValue } from './util';
import RelocationInfo from './data/relocationInfo';

export default class RelocationUtil {
  constructor(community) {
    this.community = community;
    this.relocations = [];

    // DEBUG
    window.relocationUtil = this;
  }

  handleAllRelocations() {
    for (let i = 0; i < this.relocations.length; i++) {
      const relocation = this.relocations[i];
      relocation.takeStep();
      if (relocation.hasArrived()) {
        console.log('Has arrived!!');
        relocation.person.relocating = false;
        this.community.communities[relocation.destId].handlePersonJoining(
          relocation.person
        );
        this._removeRelocationInfo(relocation);
      }
    }
  }

  insertRelocation(person) {
    // Pause
    this.community.pauseExecution();
    // Move person
    const sourceId = person.modelId;
    // Get models which very high density and exclude them from models being relocated to
    const maxTotalPopulation = Math.round(
      (this.community.stats.sum() / this.community.numModels) * 1.5
    );
    const exclude = Object.values(this.community.communities)
      .filter((mod) => mod.totalPopulation > maxTotalPopulation)
      .map((mod) => mod.id)
      .concat([sourceId]);
    // Destination Id
    const destId = getRandomIntExceptForValue(
      0,
      this.community.numModels - 1,
      exclude
    );
    // console.log(`Person is moving from ${sourceId} to ${destId}`);
    this.community.communities[sourceId].handlePersonLeaving(person);
    // this.community.communities[destId].handlePersonJoining(person);
    // Change modelId of person
    person.modelId = destId;
    const distCoords = this.community.communities[destId].getRandomPoint();

    // Do it via this
    this.relocations.push(new RelocationInfo(person, distCoords, destId));
    // Resume
    this.community.resumeExecution();
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

  // _getPersonsRelocationInfo(person) {
  //   const relocationInfo = this.relocations.filter(
  //     (rel) => rel.person === person
  //   );
  //   if (relocationInfo.length <= 0) {
  //     return null;
  //   }
  //   return relocationInfo[0];
  // }

  // takeStep(person) {
  //   const relocationInfo = this._getPersonsRelocationInfo(person);
  //   if (!relocationInfo) {
  //     throw Error(
  //       'Trying to relocate a person who does not have a relocation info object!'
  //     );
  //   }
  //   // For now!!!
  //   person.relocateMove();
  //   // In here check when the person arrives and remove him
  //   if (this.hasArrived(person)) {
  //     person.relocating = false;
  //     this._removeRelocationInfo(relocationInfo);
  //   }
  // }
}
