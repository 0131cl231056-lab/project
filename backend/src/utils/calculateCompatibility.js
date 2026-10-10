export function calculateCompatibility(userPrefs, roomPrefs) {
    let score = 0;

    if (!userPrefs || !roomPrefs) {
        return 0;
    }

    // Gender - 20 points
    if (
        roomPrefs.gender === "Any" ||
        roomPrefs.gender?.toLowerCase() === userPrefs.preferredGender?.toLowerCase()
    ) {
        score += 20;
    }

    // Diet - 20 points
    const userDiet = userPrefs.diet?.toLowerCase();
    const roomDiet = roomPrefs.diet?.toLowerCase();

    if (
        roomDiet === "doesn't matter" ||
        roomDiet === "any" ||
        roomDiet === userDiet
    ) {
        score += 20;
    }

    // Cleanliness - 20 points
    if (
        userPrefs.cleanliness?.toLowerCase() ===
        roomPrefs.cleanliness?.toLowerCase()
    ) {
        score += 20;
    }

    // Smoking - 15 points
    const smokingMatches =
        roomPrefs.smoking === "Doesn't Matter" ||
        (roomPrefs.smoking === "Yes" && userPrefs.smoking === true) ||
        (roomPrefs.smoking === "No" && userPrefs.smoking === false);

    if (smokingMatches) {
        score += 15;
    }

    // Drinking - 15 points
    const drinkingMatches =
        roomPrefs.drinking === "Doesn't Matter" ||
        (roomPrefs.drinking === "Yes" && userPrefs.drinking === true) ||
        (roomPrefs.drinking === "No" && userPrefs.drinking === false);

    if (drinkingMatches) {
        score += 15;
    }

    // Sleep schedule - 10 points
    if (
        userPrefs.sleepSchedule?.toLowerCase() ===
        roomPrefs.sleepSchedule?.toLowerCase()
    ) {
        score += 10;
    }

    return score;
}

const PREFERENCE_LABELS = {
    sleepSchedule: {
        earlyBird: "Early Bird",
        nightOwl: "Night Owl"
    },
    diet: {
        vegetarian: "Vegetarian",
        "non-vegetarian": "Non-Vegetarian",
        vegan: "Vegan"
    },
    cleanliness: {
        high: "High Cleanliness",
        medium: "Moderate Cleanliness",
        low: "Relaxed Cleanliness"
    },
    guestFrequency: {
        rarely: "Rarely Guests",
        sometimes: "Occasional Guests",
        often: "Frequent Guests"
    },
    noiseTolerance: {
        low: "Quiet (Low Tolerance)",
        medium: "Moderate Noise",
        high: "High Noise Tolerance"
    },
    studyEnvironment: {
        quiet: "Quiet Study",
        moderate: "Moderate Study",
        social: "Social / Collaborative"
    },
    workSchedule: {
        workFromHome: "Work From Home",
        office: "In-Office",
        hybrid: "Hybrid Work",
        student: "Student"
    },
    sharingPreference: {
        shareRoom: "Shared Room",
        privateRoom: "Private Room"
    },
    preferredGender: {
        any: "Any Gender",
        male: "Male Only",
        female: "Female Only"
    }
};

export function formatPreferenceValue(key, val) {
    if (val === undefined || val === null || val === "") return "Not Specified";
    if (typeof val === "boolean") {
        if (key === "smoking") return val ? "Smoker" : "Non-Smoker";
        if (key === "drinking") return val ? "Drinker" : "Non-Drinker";
        if (key === "pets") return val ? "Has / Likes Pets" : "No Pets";
        return val ? "Yes" : "No";
    }
    if (PREFERENCE_LABELS[key] && PREFERENCE_LABELS[key][val]) {
        return PREFERENCE_LABELS[key][val];
    }
    return String(val)
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase());
}

export function calculateRoommateCompatibility(userA, userB) {
    if (!userA || !userB) {
        return { score: null, breakdown: [] };
    }

    const prefsA = userA.preferences || {};
    const prefsB = userB.preferences || {};

    const hasAnyPrefA = Object.keys(prefsA).some((k) => prefsA[k] !== undefined && prefsA[k] !== null && prefsA[k] !== "");
    const hasAnyPrefB = Object.keys(prefsB).some((k) => prefsB[k] !== undefined && prefsB[k] !== null && prefsB[k] !== "");

    if (!hasAnyPrefA || !hasAnyPrefB) {
        return { score: null, breakdown: [] };
    }

    let score = 0;

    // 1. Gender Alignment (10 points)
    const prefGenderA = prefsA.preferredGender?.toLowerCase() || "any";
    const prefGenderB = prefsB.preferredGender?.toLowerCase() || "any";
    const genderA = userA.gender?.toLowerCase();
    const genderB = userB.gender?.toLowerCase();

    const aAcceptsB = prefGenderA === "any" || !genderB || prefGenderA === genderB;
    const bAcceptsA = prefGenderB === "any" || !genderA || prefGenderB === genderA;
    const genderMatch = aAcceptsB && bAcceptsA;
    if (genderMatch) score += 10;

    // 2. Sleep Schedule (15 points)
    const sleepMatch =
        Boolean(prefsA.sleepSchedule && prefsB.sleepSchedule) &&
        prefsA.sleepSchedule.toLowerCase() === prefsB.sleepSchedule.toLowerCase();
    if (sleepMatch) score += 15;

    // 3. Diet (15 points)
    const dietMatch =
        Boolean(prefsA.diet && prefsB.diet) &&
        prefsA.diet.toLowerCase() === prefsB.diet.toLowerCase();
    if (dietMatch) score += 15;

    // 4. Cleanliness (15 points)
    const cleanMatch =
        Boolean(prefsA.cleanliness && prefsB.cleanliness) &&
        prefsA.cleanliness.toLowerCase() === prefsB.cleanliness.toLowerCase();
    if (cleanMatch) {
        score += 15;
    } else if (
        (prefsA.cleanliness === "medium" && (prefsB.cleanliness === "high" || prefsB.cleanliness === "low")) ||
        (prefsB.cleanliness === "medium" && (prefsA.cleanliness === "high" || prefsA.cleanliness === "low"))
    ) {
        score += 8; // partial points for adjacent cleanliness
    }

    // 5. Smoking (10 points)
    const smokingMatch = Boolean(prefsA.smoking) === Boolean(prefsB.smoking);
    if (smokingMatch) score += 10;

    // 6. Drinking (5 points)
    const drinkingMatch = Boolean(prefsA.drinking) === Boolean(prefsB.drinking);
    if (drinkingMatch) score += 5;

    // 7. Study Environment (10 points)
    const studyMatch =
        Boolean(prefsA.studyEnvironment && prefsB.studyEnvironment) &&
        prefsA.studyEnvironment.toLowerCase() === prefsB.studyEnvironment.toLowerCase();
    if (studyMatch) score += 10;

    // 8. Work Schedule (10 points)
    const workMatch =
        Boolean(prefsA.workSchedule && prefsB.workSchedule) &&
        prefsA.workSchedule.toLowerCase() === prefsB.workSchedule.toLowerCase();
    if (workMatch) score += 10;

    // 9. Noise Tolerance (5 points)
    const noiseMatch =
        Boolean(prefsA.noiseTolerance && prefsB.noiseTolerance) &&
        prefsA.noiseTolerance.toLowerCase() === prefsB.noiseTolerance.toLowerCase();
    if (noiseMatch) {
        score += 5;
    } else if (
        (prefsA.noiseTolerance === "medium" && (prefsB.noiseTolerance === "high" || prefsB.noiseTolerance === "low")) ||
        (prefsB.noiseTolerance === "medium" && (prefsA.noiseTolerance === "high" || prefsA.noiseTolerance === "low"))
    ) {
        score += 3;
    }

    // 10. Guest Frequency (5 points)
    const guestMatch =
        Boolean(prefsA.guestFrequency && prefsB.guestFrequency) &&
        prefsA.guestFrequency.toLowerCase() === prefsB.guestFrequency.toLowerCase();
    if (guestMatch) score += 5;

    const breakdown = [
        {
            category: "Sleep Schedule",
            match: sleepMatch,
            userValue: formatPreferenceValue("sleepSchedule", prefsA.sleepSchedule),
            roommateValue: formatPreferenceValue("sleepSchedule", prefsB.sleepSchedule)
        },
        {
            category: "Diet",
            match: dietMatch,
            userValue: formatPreferenceValue("diet", prefsA.diet),
            roommateValue: formatPreferenceValue("diet", prefsB.diet)
        },
        {
            category: "Cleanliness",
            match: cleanMatch,
            userValue: formatPreferenceValue("cleanliness", prefsA.cleanliness),
            roommateValue: formatPreferenceValue("cleanliness", prefsB.cleanliness)
        },
        {
            category: "Smoking",
            match: smokingMatch,
            userValue: formatPreferenceValue("smoking", prefsA.smoking),
            roommateValue: formatPreferenceValue("smoking", prefsB.smoking)
        },
        {
            category: "Drinking",
            match: drinkingMatch,
            userValue: formatPreferenceValue("drinking", prefsA.drinking),
            roommateValue: formatPreferenceValue("drinking", prefsB.drinking)
        },
        {
            category: "Study Environment",
            match: studyMatch,
            userValue: formatPreferenceValue("studyEnvironment", prefsA.studyEnvironment),
            roommateValue: formatPreferenceValue("studyEnvironment", prefsB.studyEnvironment)
        },
        {
            category: "Work Schedule",
            match: workMatch,
            userValue: formatPreferenceValue("workSchedule", prefsA.workSchedule),
            roommateValue: formatPreferenceValue("workSchedule", prefsB.workSchedule)
        },
        {
            category: "Noise Tolerance",
            match: noiseMatch,
            userValue: formatPreferenceValue("noiseTolerance", prefsA.noiseTolerance),
            roommateValue: formatPreferenceValue("noiseTolerance", prefsB.noiseTolerance)
        },
        {
            category: "Guest Frequency",
            match: guestMatch,
            userValue: formatPreferenceValue("guestFrequency", prefsA.guestFrequency),
            roommateValue: formatPreferenceValue("guestFrequency", prefsB.guestFrequency)
        },
        {
            category: "Pets",
            match: Boolean(prefsA.pets) === Boolean(prefsB.pets),
            userValue: formatPreferenceValue("pets", prefsA.pets),
            roommateValue: formatPreferenceValue("pets", prefsB.pets)
        },
        {
            category: "Gender Preference",
            match: genderMatch,
            userValue: formatPreferenceValue("preferredGender", prefsA.preferredGender),
            roommateValue: formatPreferenceValue("preferredGender", prefsB.preferredGender)
        }
    ];

    const finalScore = Math.min(100, Math.max(0, Math.round(score)));

    return {
        score: finalScore,
        breakdown
    };
}