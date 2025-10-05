import sys
from text_process import process_pdf 

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Error: PDF Path not provided")
        sys.exit(1)
        
    pdf_path = sys.argv[1]  
    process_pdf(pdf_path)
