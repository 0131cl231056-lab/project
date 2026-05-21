export function calculateCompatibility(userPrefs, roomPrefs) {

   let score = 0

   if (
      roomPrefs.gender === "any" ||
      userPrefs.gender === roomPrefs.gender
   ) {
      score += 20
   }

   if (
      roomPrefs.diet === "any" ||
      userPrefs.diet === roomPrefs.diet
   ) {
      score += 20
   }

   if (
      userPrefs.cleanliness === roomPrefs.cleanliness
   ) {
      score += 20
   }

   if (
      userPrefs.smoking === roomPrefs.smoking
   ) {
      score += 15
   }

   if (
      userPrefs.drinking === roomPrefs.drinking
   ) {
      score += 15
   }

   if (
      userPrefs.sleepSchedule === roomPrefs.sleepSchedule
   ) {
      score += 10
   }

   return score
}