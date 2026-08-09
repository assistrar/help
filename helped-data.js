/* =====================================================================
   MAGICHELP — PEOPLE HELPED (sidebar ticker)
   =====================================================================
   This powers the auto-scrolling "Helped this week / last week" list
   next to Success Stories. Update it every week — or use admin.html.

   HOW TO UPDATE WEEKLY:
   1. Move everything currently under week: "this" down to week: "last"
      (or just delete last week's entries if you don't need to keep them).
   2. Add this week's new entries with week: "this".
   3. Each entry needs:
        name  — first name + last initial is usually enough, e.g. "Priya S."
        phone — shown as-is, format it however you'd like people to see it
   4. Save the file.

   PRIVACY NOTE: only add someone here with their OK to show their name
   and phone number publicly on the site.
   ===================================================================== */

window.MAGICHELP_HELPED = [
  { week: "this", name: "Priya S.", phone: "+1 (555) 213-0098" },
  { week: "this", name: "Maria G.", phone: "+1 (555) 402-7741" },
  { week: "this", name: "Aisha K.", phone: "+1 (555) 118-6620" },
  { week: "this", name: "Leo M.", phone: "+1 (555) 339-4415" },
  { week: "last", name: "Devon R.", phone: "+1 (555) 267-8890" },
  { week: "last", name: "Sam T.", phone: "+1 (555) 501-2234" },
  { week: "last", name: "Nadia B.", phone: "+1 (555) 674-3312" },
  { week: "last", name: "Carlos V.", phone: "+1 (555) 809-5567" }
];
