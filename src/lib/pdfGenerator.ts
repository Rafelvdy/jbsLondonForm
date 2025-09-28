import { jsPDF } from 'jspdf';
import { FormState, BuildingInfo, MechanicalSystem, ElectricalSystem, ComplianceSystem, PPMSummary, PhotoMeta } from '../types/formTypes';
import { getThumbBlob } from './mediaStore';

// PDF Layout Constants
const PAGE_WIDTH = 210; // A4 width in mm
const PAGE_HEIGHT = 297; // A4 height in mm
const MARGIN = 20;
const CONTENT_WIDTH = PAGE_WIDTH - (MARGIN * 2);
const LINE_HEIGHT = 7;
const SECTION_SPACING = 15;

// Typography
const FONT_SIZE_TITLE = 20;
const FONT_SIZE_SUBTITLE = 16;
const FONT_SIZE_SECTION = 14;
const FONT_SIZE_BODY = 10;
const FONT_SIZE_SMALL = 8;

// Photo Layout
const PHOTO_WIDTH = 50;
const PHOTO_HEIGHT = 40;
const PHOTOS_PER_ROW = 3;
const PHOTO_SPACING = 5;

/**
 * Main function to generate and download PDF from form state
 */
export async function generateAndDownloadPDF(formState: FormState): Promise<void> {
    try {
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        // Phase B: Core pages
        addTitleAndBuildingInfo(pdf, formState.buildingInfo);
        
        if (formState.mechanicalSystems.length > 0) {
            await addMechanicalSystems(pdf, formState.mechanicalSystems);
        }
        
        if (formState.electricalSystems.length > 0) {
            await addElectricalSystems(pdf, formState.electricalSystems);
        }
        
        if (formState.complianceSystems.length > 0) {
            await addComplianceSystems(pdf, formState.complianceSystems);
        }
        
        addPPMSummary(pdf, formState.ppmSummary, formState);
        
        // Generate filename and download
        const filename = generateFilename(formState.buildingInfo.siteName);
        pdf.save(filename);
        
        console.log('PDF generated and downloaded successfully:', filename);
    } catch (error) {
        console.error('PDF generation failed:', error);
        throw new Error('Failed to generate PDF. Please try again.');
    }
}

/**
 * Generate sanitized filename for PDF
 */
function generateFilename(siteName: string): string {
    const sanitizedSiteName = siteName
        .replace(/[^a-zA-Z0-9\s-_]/g, '') // Remove special characters
        .replace(/\s+/g, '_') // Replace spaces with underscores
        .substring(0, 50) // Limit length
        || 'JBS_Survey'; // Fallback if empty
    
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
    return `${sanitizedSiteName}_PPM_Survey_${timestamp}.pdf`;
}

/**
 * Convert blob to base64 for PDF embedding
 */
async function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            // Remove data URL prefix to get pure base64
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

/**
 * Add title page and building information
 */
function addTitleAndBuildingInfo(pdf: jsPDF, buildingInfo: BuildingInfo): void {
    let yPos = MARGIN + 20;
    
    // Title
    pdf.setFontSize(FONT_SIZE_TITLE);
    pdf.setFont('helvetica', 'bold');
    pdf.text('JBS LONDON', PAGE_WIDTH / 2, yPos, { align: 'center' });
    
    yPos += 12;
    pdf.setFontSize(FONT_SIZE_SUBTITLE);
    pdf.text('PPM Survey & Costing Sheet', PAGE_WIDTH / 2, yPos, { align: 'center' });
    
    yPos += 8;
    pdf.setFontSize(FONT_SIZE_BODY);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Mechanical & Electrical - Commercial Building', PAGE_WIDTH / 2, yPos, { align: 'center' });
    
    yPos += 20;
    
    // Metadata
    const currentDate = new Date().toLocaleString();
    pdf.setFontSize(FONT_SIZE_SMALL);
    pdf.text(`Generated: ${currentDate}`, MARGIN, yPos);
    yPos += LINE_HEIGHT;
    
    const lastModified = new Date().toLocaleString(); // Use current time as placeholder
    pdf.text(`Last Modified: ${lastModified}`, MARGIN, yPos);
    
    yPos += SECTION_SPACING;
    
    // Section divider
    pdf.setLineWidth(0.5);
    pdf.line(MARGIN, yPos, PAGE_WIDTH - MARGIN, yPos);
    yPos += 10;
    
    // Building Information Section
    pdf.setFontSize(FONT_SIZE_SECTION);
    pdf.setFont('helvetica', 'bold');
    pdf.text('BUILDING INFORMATION', PAGE_WIDTH / 2, yPos, { align: 'center' });
    
    yPos += 5;
    pdf.line(MARGIN, yPos, PAGE_WIDTH - MARGIN, yPos);
    yPos += 15;
    
    // Building info fields
    pdf.setFontSize(FONT_SIZE_BODY);
    pdf.setFont('helvetica', 'normal');
    
    const fields = [
        { label: 'Site Name:', value: buildingInfo.siteName || 'N/A' },
        { label: 'Address:', value: buildingInfo.address || 'N/A' },
        { label: 'Surveyed By:', value: buildingInfo.surveyedBy || 'N/A' },
        { label: 'Client Contact:', value: buildingInfo.clientContact || 'N/A' },
        { label: 'Building Type:', value: buildingInfo.buildingType || 'N/A' },
        { label: 'Building Size:', value: buildingInfo.buildingSize ? `${buildingInfo.buildingSize} sq ft` : 'N/A' }
    ];
    
    fields.forEach(field => {
        pdf.setFont('helvetica', 'bold');
        pdf.text(field.label, MARGIN, yPos);
        pdf.setFont('helvetica', 'normal');
        pdf.text(field.value, MARGIN + 40, yPos);
        yPos += LINE_HEIGHT + 2;
    });
}

/**
 * Add mechanical systems pages
 */
async function addMechanicalSystems(pdf: jsPDF, systems: MechanicalSystem[]): Promise<void> {
    pdf.addPage();
    let yPos = addSectionHeader(pdf, 'MECHANICAL SYSTEMS');
    
    for (const system of systems) {
        yPos = await addSystemCard(pdf, system, yPos, 'mechanical');
        
        // Check if we need a new page
        if (yPos > PAGE_HEIGHT - 50) {
            pdf.addPage();
            yPos = MARGIN + 20;
        }
    }
}

/**
 * Add electrical systems pages
 */
async function addElectricalSystems(pdf: jsPDF, systems: ElectricalSystem[]): Promise<void> {
    pdf.addPage();
    let yPos = addSectionHeader(pdf, 'ELECTRICAL SYSTEMS');
    
    for (const system of systems) {
        yPos = await addSystemCard(pdf, system, yPos, 'electrical');
        
        // Check if we need a new page
        if (yPos > PAGE_HEIGHT - 50) {
            pdf.addPage();
            yPos = MARGIN + 20;
        }
    }
}

/**
 * Add compliance systems pages
 */
async function addComplianceSystems(pdf: jsPDF, systems: ComplianceSystem[]): Promise<void> {
    pdf.addPage();
    let yPos = addSectionHeader(pdf, 'COMPLIANCE & OTHER SYSTEMS');
    
    for (const system of systems) {
        yPos = await addComplianceSystemCard(pdf, system, yPos);
        
        // Check if we need a new page
        if (yPos > PAGE_HEIGHT - 50) {
            pdf.addPage();
            yPos = MARGIN + 20;
        }
    }
}

/**
 * Add section header
 */
function addSectionHeader(pdf: jsPDF, title: string): number {
    let yPos = MARGIN + 20;
    
    pdf.setFontSize(FONT_SIZE_SECTION);
    pdf.setFont('helvetica', 'bold');
    pdf.text(title, PAGE_WIDTH / 2, yPos, { align: 'center' });
    
    yPos += 5;
    pdf.setLineWidth(0.5);
    pdf.line(MARGIN, yPos, PAGE_WIDTH - MARGIN, yPos);
    yPos += 15;
    
    return yPos;
}

/**
 * Add system card for mechanical/electrical systems
 */
async function addSystemCard(pdf: jsPDF, system: MechanicalSystem | ElectricalSystem, startY: number, systemType: 'mechanical' | 'electrical'): Promise<number> {
    let yPos = startY;
    
    // System card border
    const cardHeight = 80; // Base height, will adjust for photos
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.3);
    pdf.rect(MARGIN, yPos, CONTENT_WIDTH, cardHeight);
    
    yPos += 8;
    
    // System title
    pdf.setFontSize(FONT_SIZE_BODY + 1);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`System: ${system.systemLabel}`, MARGIN + 5, yPos);
    
    yPos += 6;
    pdf.setFontSize(FONT_SIZE_SMALL);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Added: ${system.dateAdded.toLocaleDateString()}`, MARGIN + 5, yPos);
    
    yPos += 10;
    
    // System details in two columns
    const leftCol = MARGIN + 5;
    const rightCol = MARGIN + (CONTENT_WIDTH / 2);
    
    pdf.setFontSize(FONT_SIZE_SMALL);
    
    // Left column
    const leftFields = [
        { label: 'Quantity:', value: system.quantity.toString() },
        { label: 'Location:', value: system.location || 'N/A' },
        { label: 'Condition:', value: system.condition || 'N/A' },
        { label: 'Manufacturer:', value: system.manufacturer || 'N/A' }
    ];
    
    let leftY = yPos;
    leftFields.forEach(field => {
        pdf.setFont('helvetica', 'bold');
        pdf.text(field.label, leftCol, leftY);
        pdf.setFont('helvetica', 'normal');
        pdf.text(field.value, leftCol + 25, leftY);
        leftY += 6;
    });
    
    // Right column
    const rightFields = [
        { label: 'Model:', value: system.model || 'N/A' },
        { label: 'Service Interval:', value: system.serviceInterval || 'N/A' },
        { label: 'Notes:', value: system.notes || 'N/A' }
    ];
    
    let rightY = yPos;
    rightFields.forEach(field => {
        pdf.setFont('helvetica', 'bold');
        pdf.text(field.label, rightCol, rightY);
        pdf.setFont('helvetica', 'normal');
        // Truncate long text
        const maxWidth = (CONTENT_WIDTH / 2) - 30;
        const text = field.value.length > 30 ? field.value.substring(0, 30) + '...' : field.value;
        pdf.text(text, rightCol + 25, rightY);
        rightY += 6;
    });
    
    yPos = Math.max(leftY, rightY) + 5;
    
    // Add photos if available
    if (system.photos && system.photos.length > 0) {
        yPos = await addSystemPhotos(pdf, system.photos, MARGIN + 5, yPos);
    }
    
    return yPos + 15; // Add spacing after card
}

/**
 * Add compliance system card
 */
async function addComplianceSystemCard(pdf: jsPDF, system: ComplianceSystem, startY: number): Promise<number> {
    let yPos = startY;
    
    // System card border
    const cardHeight = 60;
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.3);
    pdf.rect(MARGIN, yPos, CONTENT_WIDTH, cardHeight);
    
    yPos += 8;
    
    // System title
    pdf.setFontSize(FONT_SIZE_BODY + 1);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`System: ${system.systemLabel}`, MARGIN + 5, yPos);
    
    yPos += 6;
    pdf.setFontSize(FONT_SIZE_SMALL);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Added: ${system.dateAdded.toLocaleDateString()}`, MARGIN + 5, yPos);
    
    yPos += 10;
    
    // Compliance fields
    pdf.setFontSize(FONT_SIZE_SMALL);
    
    const fields = [
        { label: 'Compliance Status:', value: system.complianceStatus === 'yes' ? 'Yes' : 'No' },
        { label: 'Last Inspection Date:', value: system.lastInspectionDate || 'N/A' },
        { label: 'Notes:', value: system.notes || 'N/A' }
    ];
    
    fields.forEach(field => {
        pdf.setFont('helvetica', 'bold');
        pdf.text(field.label, MARGIN + 5, yPos);
        pdf.setFont('helvetica', 'normal');
        const text = field.value.length > 50 ? field.value.substring(0, 50) + '...' : field.value;
        pdf.text(text, MARGIN + 45, yPos);
        yPos += 6;
    });
    
    yPos += 5;
    
    // Add photos if available
    if (system.photos && system.photos.length > 0) {
        yPos = await addSystemPhotos(pdf, system.photos, MARGIN + 5, yPos);
    }
    
    return yPos + 15;
}

/**
 * Add system photos in grid layout
 */
async function addSystemPhotos(pdf: jsPDF, photos: PhotoMeta[], x: number, y: number): Promise<number> {
    const maxPhotos = 6;
    const photosToShow = photos.slice(0, maxPhotos);
    
    if (photosToShow.length === 0) return y;
    
    // Photos label
    pdf.setFontSize(FONT_SIZE_SMALL);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Photos:', x, y);
    y += 8;
    
    const currentY = y;
    
    for (let i = 0; i < photosToShow.length; i++) {
        const photo = photosToShow[i];
        const row = Math.floor(i / PHOTOS_PER_ROW);
        const col = i % PHOTOS_PER_ROW;
        
        const photoX = x + (col * (PHOTO_WIDTH + PHOTO_SPACING));
        const photoY = currentY + (row * (PHOTO_HEIGHT + PHOTO_SPACING));
        
        try {
            const thumbBlob = await getThumbBlob(photo.id);
            if (thumbBlob) {
                const base64 = await blobToBase64(thumbBlob);
                pdf.addImage(base64, 'JPEG', photoX, photoY, PHOTO_WIDTH, PHOTO_HEIGHT);
            } else {
                // Draw placeholder rectangle
                pdf.setDrawColor(150, 150, 150);
                pdf.setFillColor(240, 240, 240);
                pdf.rect(photoX, photoY, PHOTO_WIDTH, PHOTO_HEIGHT, 'FD');
                
                // Add "No Image" text
                pdf.setFontSize(6);
                pdf.setTextColor(100, 100, 100);
                pdf.text('No Image', photoX + PHOTO_WIDTH/2, photoY + PHOTO_HEIGHT/2, { align: 'center' });
                pdf.setTextColor(0, 0, 0); // Reset text color
            }
        } catch (error) {
            console.warn(`Failed to embed photo ${photo.id}:`, error);
            // Draw error placeholder
            pdf.setDrawColor(200, 100, 100);
            pdf.setFillColor(250, 240, 240);
            pdf.rect(photoX, photoY, PHOTO_WIDTH, PHOTO_HEIGHT, 'FD');
        }
    }
    
    const rows = Math.ceil(photosToShow.length / PHOTOS_PER_ROW);
    return currentY + (rows * (PHOTO_HEIGHT + PHOTO_SPACING)) + 5;
}

/**
 * Add PPM costing summary page
 */
function addPPMSummary(pdf: jsPDF, ppmSummary: PPMSummary, formState: FormState): void {
    pdf.addPage();
    let yPos = addSectionHeader(pdf, 'PPM COSTING SUMMARY');
    
    // PPM fields
    pdf.setFontSize(FONT_SIZE_BODY);
    
    const fields = [
        { label: 'Task/Asset:', value: ppmSummary.taskAsset || 'N/A' },
        { label: 'Frequency:', value: ppmSummary.frequency || 'N/A' },
        { label: 'Labour Hours:', value: ppmSummary.labourHours.toString() },
        { label: 'Materials:', value: ppmSummary.materials || 'N/A' },
        { label: 'Subcontract:', value: ppmSummary.subcontract || 'N/A' },
        { label: 'Total Cost (Est.):', value: ppmSummary.totalCost ? `£${ppmSummary.totalCost.toFixed(2)}` : 'N/A' }
    ];
    
    fields.forEach(field => {
        pdf.setFont('helvetica', 'bold');
        pdf.text(field.label, MARGIN, yPos);
        pdf.setFont('helvetica', 'normal');
        pdf.text(field.value, MARGIN + 50, yPos);
        yPos += LINE_HEIGHT + 2;
    });
    
    yPos += 10;
    
    // Notes & Recommendations
    if (ppmSummary.notesRecommendations) {
        pdf.setFont('helvetica', 'bold');
        pdf.text('Notes & Recommendations:', MARGIN, yPos);
        yPos += LINE_HEIGHT + 2;
        
        pdf.setFont('helvetica', 'normal');
        const lines = pdf.splitTextToSize(ppmSummary.notesRecommendations, CONTENT_WIDTH);
        pdf.text(lines, MARGIN, yPos);
        yPos += (lines.length * LINE_HEIGHT) + 10;
    }
    
    // Summary statistics
    yPos += 10;
    pdf.setLineWidth(0.3);
    pdf.line(MARGIN, yPos, PAGE_WIDTH - MARGIN, yPos);
    yPos += 15;
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('Summary:', MARGIN, yPos);
    yPos += LINE_HEIGHT + 5;
    
    pdf.setFont('helvetica', 'normal');
    const stats = [
        `• Mechanical Systems: ${formState.mechanicalSystems.length}`,
        `• Electrical Systems: ${formState.electricalSystems.length}`,
        `• Compliance Systems: ${formState.complianceSystems.length}`,
        `• Total Photos Attached: ${getTotalPhotoCount(formState)}`
    ];
    
    stats.forEach(stat => {
        pdf.text(stat, MARGIN, yPos);
        yPos += LINE_HEIGHT;
    });
    
    // Footer
    yPos = PAGE_HEIGHT - 30;
    pdf.setFontSize(FONT_SIZE_SMALL);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Generated by JBS London Forms v1.0', MARGIN, yPos);
    pdf.text(new Date().toLocaleString(), PAGE_WIDTH - MARGIN, yPos, { align: 'right' });
}

/**
 * Calculate total photo count across all systems
 */
function getTotalPhotoCount(formState: FormState): number {
    const mechanicalPhotos = formState.mechanicalSystems.reduce((sum, sys) => sum + (sys.photos?.length || 0), 0);
    const electricalPhotos = formState.electricalSystems.reduce((sum, sys) => sum + (sys.photos?.length || 0), 0);
    const compliancePhotos = formState.complianceSystems.reduce((sum, sys) => sum + (sys.photos?.length || 0), 0);
    
    return mechanicalPhotos + electricalPhotos + compliancePhotos;
}
