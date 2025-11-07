// ```javascript
import { jsPDF } from 'jspdf';
// import html2canvas from 'html2canvas';
import html2canvas from 'html2canvas-pro';

export const generatePDF = async (containerClass = 'result-list-container', marksheetClass = 'single-marksheet', fileName = 'marksheets.pdf', orientation="portrait", format="a4", w=210, h=297) => {
  try {
    // Get the container
    const container = document.querySelector(`.${containerClass}`);
    if (!container) {
      throw new Error(`No container found with class ${containerClass}`);
    }

    // Get all marksheet divs within the container
    const divs = container.getElementsByClassName(marksheetClass);
    if (divs.length === 0) {
      throw new Error(`No elements found with class ${marksheetClass} inside ${containerClass}`);
    }

    // Create a new jsPDF instance (A4 size: 210mm x 297mm)
    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: format,
    });

    // A4 dimensions (in mm)
    const pageWidth =w;
    const pageHeight = h;


    const margin = 6;
    const contentWidth = pageWidth - 2 * margin; // 170mm
    const contentHeight = pageHeight - 2 * margin; // 257mm


    // Create a new jsPDF instance (Legal size: 215.9mm x 355.6mm)
    // const pdf = new jsPDF({
    //   orientation: 'landscape',
    //   unit: 'mm',
    //   format: 'legal',
    // });

    // // Legal dimensions (in mm)
    // const pageWidth = 215.9; // 8.5 inches
    // const pageHeight = 355.6; // 14 inches 

    // Create a temporary container for rendering
    const tempContainer = document.createElement('div');
    // tempContainer.style.position = 'absolute';
    // tempContainer.style.top = '-9999px';
    // tempContainer.style.left = '-9999px';
    document.body.appendChild(tempContainer);

    // Apply safe print styles (avoiding oklch)
    const style = document.createElement('style');
    style.textContent = `
      .print-button {
        display: none !important;
      }
        
       

  body {
    // border: 1px solid red;
    
    // transform: scale(0.98);       /* Adjust the scale factor */
    // transform-origin: top left center;  /* Prevent shifting */
    margin: 0px;
    padding: 0px;
    max-width: 200mm; 
    background-color: white !important;
    
  }


    .result-table { 
      // border: 1px solid #183169;
      margin-top: 24px; 
      font-size: 11px !important; 
      width: 100%;
      display: flex;
      flex-wrap: wrap; 
      justify-content: space-between !important;
      position: relative;

      .result-box {
        height: 30px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;

        &.gpa, &.letter-grade, &.rank {
          .text {
            background-color: #f2ffc0;
            border-radius: 8px 0 0 8px;
            border: 1px solid #183169;
            border-right: 0;
            padding: 5px 4px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .value {
            border-radius: 0 8px 8px 0;
            border: 1px solid #183169;
            padding: 5px 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: "Noto Sans Bengali", sans-serif !important;
            font-weight: 400;
            font-style: normal; 
          }
        }
      }
    }
  


  .wrap {
    margin-top: auto !important;
  }

  .modal-overlay {
    padding: 0 !important; 
    
  }
  .modal-content{
    border-radius: 0 !important;
  }
  

  table th, table td {
    padding: 2px 3px;
  }

  .print-button {
    display: none;
  }

  .single-marksheet{ 
    width: 100%;
    margin-top: 50px;
    page-break-after: always !important; 
    padding: 0px;  
    padding: 30px 20px;  
    break-after: page;

    break-before: page !important;
    break-after: page !important;
    break-inside: avoid !important;

    // border: 1px solid rgb(234, 230, 230);;
    // border-radius: 12px;
    
  }

  .single-marksheet, .result-table, .marksheet-header {
    width: 100%;
    max-width: 200mm; 
  } 

  // #highest-marks{
  //   font-size: 10px;
  // }
        
      `;
    document.head.appendChild(style);

    // Loop through each marksheet div
    for (let i = 0; i < divs.length; i++) {
      const div = divs[i];

      // Clone the div to isolate styles
      const clonedDiv = div.cloneNode(true);
      clonedDiv.classList.add('single-marksheet');
      tempContainer.appendChild(clonedDiv);

       
      // Capture the cloned div as a canvas
      const canvas = await html2canvas(clonedDiv, {
        scale: 2, // Higher resolution
        useCORS: true, // Handle cross-origin images
        width: contentWidth * 3.78, // mm to pixels (1mm ≈ 3.78px at 96dpi)
        height: contentHeight * 3.78,
        backgroundColor: '#ffffff',
      });

      // Convert canvas to image
      const imgData = canvas.toDataURL('image/png');

      // Add image to PDF
      if (i > 0) {
        pdf.addPage();
      }
      pdf.addImage(
        imgData,
        'PNG',
        margin, // x position
        margin, // y position
        contentWidth, // width
        contentHeight // height
      );

      // Remove the cloned div
      tempContainer.removeChild(clonedDiv);
    }

    // Clean up
    document.head.removeChild(style);
    document.body.removeChild(tempContainer);

    // Save the PDF
    pdf.save(fileName);
  } catch (error) {
    console.error('Error generating PDF:', error.message);
    alert(`Failed to generate PDF: ${error.message}`);
  }
};
// ```