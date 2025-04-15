import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
import pickle
# 1. Load dataset
data = pd.read_csv(r"E:\Projects\ML projects\Breast cancer\bcdata.csv")

# 2. Drop unnecessary columns
data.drop(['id', 'Unnamed: 32'], axis=1, inplace=True)

# 3. Encode target column
data['diagnosis'] = data['diagnosis'].map({'M': 1, 'B': 0})

# 4. Drop or fill missing values
data.dropna(inplace=True)  # Or use data.fillna(data.mean(), inplace=True)

# 5. Split features and target
X = data.drop(columns='diagnosis')
y = data['diagnosis']

# 6. Scale features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# 7. Train/test split
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# 8. Train logistic regression
model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

# 9. Evaluate
y_pred = model.predict(X_test)
# Save the model
with open('breast_cancer_model.pkl', 'wb') as f:
    pickle.dump(model, f)

# Save the scaler (optional, but recommended if you're scaling input)
with open('scaler.pkl', 'wb') as f:
    pickle.dump(scaler, f)