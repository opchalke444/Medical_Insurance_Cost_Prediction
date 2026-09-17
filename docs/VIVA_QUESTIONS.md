# Final-Year Engineering Examination: Viva Voce Preparation Guide
### MedCost.AI — Medical Insurance Cost Prediction

This document provides concise, technically rigorous answers to the most common questions asked by university professors and external examiners during project defenses.

---

### Q1: What problem does your project solve?
**Answer:**
MedCost.AI addresses the challenge of predicting individual annual medical expenditures based on demographic and health risk proxies. In actuarial economics, understanding cost drivers allows organizations to calculate fair, non-discriminatory premiums and identify high-risk cohorts requiring preventive care intervention. Our project delivers an end-to-end reproducible machine learning pipeline, RESTful backend, and interactive client interface to demonstrate this workflow.

---

### Q2: Why did you choose regression instead of classification?
**Answer:**
The target variable `charges` is a continuous numerical currency value (ranging continuously from $\$1,121.87$ to $\$63,770.43$). Regression models predict specific real-valued continuous quantities $\hat{y} \in \mathbb{R}^+$. Discretizing charges into arbitrary classes (e.g. "low", "medium", "high") would introduce artificial classification boundaries and destroy the granular dollar-value metric needed for actuarial calculation.

---

### Q3: Why is `charges` the target variable, and what are its statistical properties?
**Answer:**
`charges` represents the total annual medical claims paid by the insurer for a beneficiary. Statistically, it exhibits strong positive right-skewness (Mean: $\$13,279$, Median: $\$9,386$). This skewness is characteristic of healthcare economics: the vast majority of individuals incur modest preventative costs, while a small percentage suffer catastrophic hospitalizations (e.g. coronary procedures, intensive care) generating charges over $\$40,000$.

---

### Q4: Which model performed best on your test data?
**Answer:**
**KNN Regression ($k=9$)** emerged as the best-performing model across all evaluated metrics among the three project models:
- **Held-Out Test $R^2$:** **0.8185** (compared to $0.8069$ for Linear Regression and $0.8067$ for Ridge Regression).
- **Mean Absolute Error (MAE):** **$3,632.17** (reducing average prediction error by over $\$545$ compared to linear baselines).
- **Cross-Validation Stability:** Achieved a mean 5-fold CV $R^2$ of **0.7673** on the training set.
- **Why KNN Outperforms Linear & Ridge:** Linear models assume global linearity. However, demographic health factors interact non-linearly (e.g. smoking combined with high BMI creates exponential claim spikes). KNN captures these non-linear demographic clusters naturally in standardized Euclidean space.

---

### Q5: What does the $R^2$ (Coefficient of Determination) score represent?
**Answer:**
$R^2$ measures the proportion of variance in the dependent target variable (`charges`) that is predictable from the independent input features:
$$R^2 = 1 - \frac{SS_{res}}{SS_{tot}} = 1 - \frac{\sum (y_i - \hat{y}_i)^2}{\sum (y_i - \bar{y})^2}$$
An $R^2$ of $0.8185$ for KNN means our model accounts for approximately **81.85% of the total variation** in medical expenditures, with only $18.15\%$ remaining as unexplained variance.

---

### Q6: What is the difference between MAE and RMSE, and why report both?
**Answer:**
- **Mean Absolute Error (MAE):** The arithmetic average of absolute errors ($\frac{1}{n} \sum |y_i - \hat{y}_i|$). It weights all errors linearly and is intuitively interpreted in dollars (e.g., our KNN model is on average $\$3,632$ off).
- **Root Mean Squared Error (RMSE):** The square root of the average squared errors ($\sqrt{\frac{1}{n} \sum (y_i - \hat{y}_i)^2}$). Because errors are squared before averaging, RMSE penalizes large outlier errors disproportionately.
- **Why report both:** A large gap between MAE ($\$3,632$) and RMSE ($\$5,775$) confirms the presence of occasional large catastrophic hospitalization claims that are difficult to predict solely from basic demographic proxies.

---

### Q7: Why do categorical features require encoding, and why drop the first column?
**Answer:**
Machine learning algorithms compute mathematical matrix operations that cannot directly interpret strings like `"male"` or `"southeast"`. We apply `OneHotEncoder(drop='first')` to create $k-1$ binary indicator columns for a feature with $k$ categories. Dropping the first column avoids the **Dummy Variable Trap** (perfect multicollinearity), which would make the linear algebra Gram matrix $(\mathbf{X}^T \mathbf{X})$ singular and non-invertible in linear models.

---

### Q8: What is the purpose of an end-to-end `Pipeline` and `ColumnTransformer`?
**Answer:**
A scikit-learn `Pipeline` encapsulates feature scaling, one-hot encoding, and the regressor into a single unified object. 
- **Data Leakage Prevention:** Standard scaling parameters ($\mu$ and $\sigma$) are learned **strictly on training folds** and then transformed onto test folds during cross-validation.
- **Production Determinism:** At inference time, raw beneficiary dictionaries pass through the exact same preprocessing transformations without manual data massaging, eliminating train-serve skew.

---

### Q9: How does the React frontend communicate with the FastAPI backend?
**Answer:**
The frontend uses standard asynchronous HTTP `fetch` requests:
1. The client captures user inputs and sends a `POST` request with a JSON payload to `/api/v1/predict`.
2. FastAPI passes the payload through a strict Pydantic schema (`InsuranceInputSchema`) enforcing range validation (e.g. age $18-100$, BMI $10-65$) and rejecting forbidden arbitrary fields (`extra='forbid'`).
3. The backend executes in-memory prediction via `model.pkl` and returns a structured JSON response containing the bounded estimate, currency, and provenance metadata.
4. If deployed on the same domain or cloud, the client dynamically uses relative API paths to eliminate hardcoded localhost dependencies.

---

### Q10: What are the main limitations of your project?
**Answer:**
1. **Dataset Volume:** $1,337$ records is an academic benchmark sample, far smaller than commercial insurance pools.
2. **Missing Clinical Markers:** The dataset contains demographic proxies but no clinical blood panels (glucose, cholesterol), ICD-10 diagnostic history, or prior hospitalization counts.
3. **Regional Granularity:** Restricted to 4 US quadrants rather than municipal zip codes.
4. **Smoker Volatility:** Predictions on smokers have $2.6\times$ higher variance ($\text{MAE} \approx \$7,085$) due to unpredictable catastrophic clinical outcomes.
5. **Intended Use:** The system is an educational statistical estimator, not a certified actuarial pricing tool.
