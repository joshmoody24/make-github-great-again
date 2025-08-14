# Function to generate random alphanumeric string of given length
generate_random_string() {
    local length=$1
    tr -dc 'A-Za-z0-9' < /dev/urandom | head -c "$length"
}

# Create directory for the files if it doesn't exist
mkdir -p random_files

# Generate 100 files
for i in $(seq 1 100); do
    filename="random_files/file_$(printf "%03d" "$i").txt"
    echo "Generating $filename..."
    
    # Generate 300 lines
    for j in $(seq 1 80); do
        # Generate approximately 80 characters per line
        generate_random_string 80
        echo  # Add newline
    done > "$filename"
done

echo "Successfully generated 100 files in the 'random_files' directory"
