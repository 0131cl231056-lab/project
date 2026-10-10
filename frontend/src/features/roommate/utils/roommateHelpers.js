// Helper functions for Roommate discovery and compatibility matching

export const PREFERENCE_LABELS = {
  sleepSchedule: {
    earlyBird: "Early Bird",
    nightOwl: "Night Owl",
  },
  diet: {
    vegetarian: "Vegetarian",
    "non-vegetarian": "Non-Vegetarian",
    vegan: "Vegan",
  },
  cleanliness: {
    high: "High Cleanliness",
    medium: "Moderate Cleanliness",
    low: "Relaxed Cleanliness",
  },
  guestFrequency: {
    rarely: "Rarely Guests",
    sometimes: "Occasional Guests",
    often: "Frequent Guests",
  },
  noiseTolerance: {
    low: "Quiet (Low Noise)",
    medium: "Moderate Noise",
    high: "High Noise Tolerance",
  },
  studyEnvironment: {
    quiet: "Quiet Study",
    moderate: "Moderate Study",
    social: "Social / Collaborative",
  },
  workSchedule: {
    workFromHome: "Remote (WFH)",
    office: "In-Office",
    hybrid: "Hybrid Work",
    student: "Student",
  },
  sharingPreference: {
    shareRoom: "Shared Room",
    privateRoom: "Private Room",
  },
  preferredGender: {
    any: "Any Gender",
    male: "Male Only",
    female: "Female Only",
  },
};

export function formatPreferenceValue(key, val) {
  if (val === undefined || val === null || val === "") return "Not Specified";
  if (typeof val === "boolean") {
    if (key === "smoking") return val ? "Smoker" : "Non-Smoker";
    if (key === "drinking") return val ? "Social Drinker" : "Non-Drinker";
    if (key === "pets") return val ? "Pet Friendly / Has Pets" : "No Pets";
    return val ? "Yes" : "No";
  }
  if (PREFERENCE_LABELS[key] && PREFERENCE_LABELS[key][val]) {
    return PREFERENCE_LABELS[key][val];
  }
  return String(val)
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
}

export function getTopLifestyleTags(preferences) {
  if (!preferences) return [];
  const tags = [];

  if (preferences.sleepSchedule === "nightOwl") {
    tags.push({ label: "Night Owl", emoji: "🌙" });
  } else if (preferences.sleepSchedule === "earlyBird") {
    tags.push({ label: "Early Bird", emoji: "🌅" });
  }

  if (preferences.diet === "vegetarian") {
    tags.push({ label: "Vegetarian", emoji: "🥗" });
  } else if (preferences.diet === "vegan") {
    tags.push({ label: "Vegan", emoji: "🌱" });
  } else if (preferences.diet === "non-vegetarian") {
    tags.push({ label: "Non-Veg", emoji: "🥩" });
  }

  if (preferences.cleanliness === "high") {
    tags.push({ label: "High Cleanliness", emoji: "🧹" });
  } else if (preferences.cleanliness === "medium") {
    tags.push({ label: "Clean & Tidy", emoji: "✨" });
  }

  if (preferences.workSchedule === "hybrid") {
    tags.push({ label: "Hybrid", emoji: "💻" });
  } else if (preferences.workSchedule === "workFromHome") {
    tags.push({ label: "Remote (WFH)", emoji: "🏠" });
  } else if (preferences.workSchedule === "student") {
    tags.push({ label: "Student", emoji: "🎓" });
  } else if (preferences.workSchedule === "office") {
    tags.push({ label: "In-Office", emoji: "🏢" });
  }

  if (preferences.studyEnvironment === "quiet") {
    tags.push({ label: "Quiet Space", emoji: "🔇" });
  } else if (preferences.pets === true) {
    tags.push({ label: "Pet Friendly", emoji: "🐾" });
  } else if (preferences.smoking === false) {
    tags.push({ label: "Non-Smoker", emoji: "🚭" });
  }

  return tags.slice(0, 5);
}

export function getCompatibilityBadgeStyle(score) {
  if (score === null || score === undefined) {
    return {
      bg: "bg-[#F5F2E9]",
      text: "text-[#8B7E74]",
      border: "border-[#8B7E74]/20",
      label: "Match Pending",
    };
  }
  if (score >= 80) {
    return {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      indicator: "bg-emerald-500",
      label: `${score}% Match`,
    };
  }
  if (score >= 60) {
    return {
      bg: "bg-amber-50",
      text: "text-amber-800",
      border: "border-amber-200",
      indicator: "bg-amber-500",
      label: `${score}% Match`,
    };
  }
  return {
    bg: "bg-stone-50",
    text: "text-stone-700",
    border: "border-stone-200",
    indicator: "bg-stone-400",
    label: `${score}% Match`,
  };
}

export function calculateClientCompatibility(userA, userB) {
  if (!userA || !userB) {
    return { score: null, breakdown: [] };
  }

  const prefsA = userA.preferences || {};
  const prefsB = userB.preferences || {};

  const hasAnyPrefA = Object.keys(prefsA).some(
    (k) => prefsA[k] !== undefined && prefsA[k] !== null && prefsA[k] !== ""
  );
  const hasAnyPrefB = Object.keys(prefsB).some(
    (k) => prefsB[k] !== undefined && prefsB[k] !== null && prefsB[k] !== ""
  );

  if (!hasAnyPrefA || !hasAnyPrefB) {
    return { score: null, breakdown: [] };
  }

  let score = 0;

  // Gender Alignment (10 points)
  const prefGenderA = prefsA.preferredGender?.toLowerCase() || "any";
  const prefGenderB = prefsB.preferredGender?.toLowerCase() || "any";
  const genderA = userA.gender?.toLowerCase();
  const genderB = userB.gender?.toLowerCase();

  const aAcceptsB = prefGenderA === "any" || !genderB || prefGenderA === genderB;
  const bAcceptsA = prefGenderB === "any" || !genderA || prefGenderB === genderA;
  const genderMatch = aAcceptsB && bAcceptsA;
  if (genderMatch) score += 10;

  // Sleep Schedule (15 points)
  const sleepMatch =
    Boolean(prefsA.sleepSchedule && prefsB.sleepSchedule) &&
    prefsA.sleepSchedule.toLowerCase() === prefsB.sleepSchedule.toLowerCase();
  if (sleepMatch) score += 15;

  // Diet (15 points)
  const dietMatch =
    Boolean(prefsA.diet && prefsB.diet) &&
    prefsA.diet.toLowerCase() === prefsB.diet.toLowerCase();
  if (dietMatch) score += 15;

  // Cleanliness (15 points)
  const cleanMatch =
    Boolean(prefsA.cleanliness && prefsB.cleanliness) &&
    prefsA.cleanliness.toLowerCase() === prefsB.cleanliness.toLowerCase();
  if (cleanMatch) {
    score += 15;
  } else if (
    (prefsA.cleanliness === "medium" &&
      (prefsB.cleanliness === "high" || prefsB.cleanliness === "low")) ||
    (prefsB.cleanliness === "medium" &&
      (prefsA.cleanliness === "high" || prefsA.cleanliness === "low"))
  ) {
    score += 8;
  }

  // Smoking (10 points)
  const smokingMatch = Boolean(prefsA.smoking) === Boolean(prefsB.smoking);
  if (smokingMatch) score += 10;

  // Drinking (5 points)
  const drinkingMatch = Boolean(prefsA.drinking) === Boolean(prefsB.drinking);
  if (drinkingMatch) score += 5;

  // Study Environment (10 points)
  const studyMatch =
    Boolean(prefsA.studyEnvironment && prefsB.studyEnvironment) &&
    prefsA.studyEnvironment.toLowerCase() ===
      prefsB.studyEnvironment.toLowerCase();
  if (studyMatch) score += 10;

  // Work Schedule (10 points)
  const workMatch =
    Boolean(prefsA.workSchedule && prefsB.workSchedule) &&
    prefsA.workSchedule.toLowerCase() === prefsB.workSchedule.toLowerCase();
  if (workMatch) score += 10;

  // Noise Tolerance (5 points)
  const noiseMatch =
    Boolean(prefsA.noiseTolerance && prefsB.noiseTolerance) &&
    prefsA.noiseTolerance.toLowerCase() ===
      prefsB.noiseTolerance.toLowerCase();
  if (noiseMatch) {
    score += 5;
  } else if (
    (prefsA.noiseTolerance === "medium" &&
      (prefsB.noiseTolerance === "high" || prefsB.noiseTolerance === "low")) ||
    (prefsB.noiseTolerance === "medium" &&
      (prefsA.noiseTolerance === "high" || prefsA.noiseTolerance === "low"))
  ) {
    score += 3;
  }

  // Guest Frequency (5 points)
  const guestMatch =
    Boolean(prefsA.guestFrequency && prefsB.guestFrequency) &&
    prefsA.guestFrequency.toLowerCase() ===
      prefsB.guestFrequency.toLowerCase();
  if (guestMatch) score += 5;

  const breakdown = [
    {
      category: "Sleep Schedule",
      match: sleepMatch,
      userValue: formatPreferenceValue("sleepSchedule", prefsA.sleepSchedule),
      roommateValue: formatPreferenceValue("sleepSchedule", prefsB.sleepSchedule),
    },
    {
      category: "Diet",
      match: dietMatch,
      userValue: formatPreferenceValue("diet", prefsA.diet),
      roommateValue: formatPreferenceValue("diet", prefsB.diet),
    },
    {
      category: "Cleanliness",
      match: cleanMatch,
      userValue: formatPreferenceValue("cleanliness", prefsA.cleanliness),
      roommateValue: formatPreferenceValue("cleanliness", prefsB.cleanliness),
    },
    {
      category: "Smoking",
      match: smokingMatch,
      userValue: formatPreferenceValue("smoking", prefsA.smoking),
      roommateValue: formatPreferenceValue("smoking", prefsB.smoking),
    },
    {
      category: "Drinking",
      match: drinkingMatch,
      userValue: formatPreferenceValue("drinking", prefsA.drinking),
      roommateValue: formatPreferenceValue("drinking", prefsB.drinking),
    },
    {
      category: "Study Environment",
      match: studyMatch,
      userValue: formatPreferenceValue("studyEnvironment", prefsA.studyEnvironment),
      roommateValue: formatPreferenceValue("studyEnvironment", prefsB.studyEnvironment),
    },
    {
      category: "Work Schedule",
      match: workMatch,
      userValue: formatPreferenceValue("workSchedule", prefsA.workSchedule),
      roommateValue: formatPreferenceValue("workSchedule", prefsB.workSchedule),
    },
    {
      category: "Noise Tolerance",
      match: noiseMatch,
      userValue: formatPreferenceValue("noiseTolerance", prefsA.noiseTolerance),
      roommateValue: formatPreferenceValue("noiseTolerance", prefsB.noiseTolerance),
    },
    {
      category: "Guest Frequency",
      match: guestMatch,
      userValue: formatPreferenceValue("guestFrequency", prefsA.guestFrequency),
      roommateValue: formatPreferenceValue("guestFrequency", prefsB.guestFrequency),
    },
    {
      category: "Pets",
      match: Boolean(prefsA.pets) === Boolean(prefsB.pets),
      userValue: formatPreferenceValue("pets", prefsA.pets),
      roommateValue: formatPreferenceValue("pets", prefsB.pets),
    },
    {
      category: "Preferred Gender",
      match: genderMatch,
      userValue: formatPreferenceValue("preferredGender", prefsA.preferredGender),
      roommateValue: formatPreferenceValue("preferredGender", prefsB.preferredGender),
    },
  ];

  return {
    score: Math.min(100, Math.max(0, Math.round(score))),
    breakdown,
  };
}
