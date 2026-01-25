import * as XLSX from 'xlsx';

export function exportVolunteersToExcel(volunteers, fileName = 'volunteers.xlsx') {
    // Prepare data for worksheet
    const data = volunteers.map(v => ({
        ID: v.id,
        Name: v.fullName,
        Email: v.email,
        Institution: v.institution,
        Role: v.role,
        Country: v.country,
        Experience: Array.isArray(v.experience) ? v.experience.join(', ') : '',
        Interests: Array.isArray(v.interests) ? v.interests.join(', ') : '',
        OtherInterests: v.otherInterests || '',
        Background: v.background || '',
        Availability: v.availability || '',
        Status: v.status,
        SubmittedAt: v.submittedAt,
        ApprovedAt: v.approvedAt || '',
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Volunteers');
    XLSX.writeFile(wb, fileName);
}
