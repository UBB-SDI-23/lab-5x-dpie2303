import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime

# Assuming data is a csv
data = pd.read_csv('cpu_usage2.csv')

# Convert timestamps to datetime
data['Timestamp'] = data['Timestamp'].apply(lambda x: datetime.fromtimestamp(x))

# Set Timestamp as the index (required for resampling)
data.set_index('Timestamp', inplace=True)

# Resample and compute average CPU usage over 1-minute intervals
data_resampled = data.resample('10S').max()

# Reset index so that Timestamp is a column again
data_resampled.reset_index(inplace=True)

# Convert Timestamp back to string for plotting
data_resampled['Timestamp'] = data_resampled['Timestamp'].dt.strftime('%H:%M:%S')

# Plot average CPU usage over time
plt.figure(figsize=(10,6))
plt.plot(data_resampled['Timestamp'], data_resampled['CPU Usage (%)'])
plt.xlabel('Time (Hour:Minute:Second)')
plt.ylabel('Average CPU Usage (%)')
plt.title('Average CPU Usage Over Time')
plt.xticks(rotation=45)
plt.tight_layout()
# Save the plot as a PNG
plt.savefig('cpu_usage.png')