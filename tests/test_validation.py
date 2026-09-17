import pytest
from pydantic import ValidationError
from backend.app.schemas.prediction import InsuranceInputSchema

def test_valid_input_schema():
    data = {
        "age": 28,
        "sex": "Female",  # Should be normalized to female
        "bmi": 23.4,
        "children": 0,
        "smoker": "NO",   # Should be normalized to no
        "region": "Southwest"  # Should be normalized to southwest
    }
    schema = InsuranceInputSchema(**data)
    assert schema.age == 28
    assert schema.sex == "female"
    assert schema.smoker == "no"
    assert schema.region == "southwest"

def test_age_boundary_limits():
    # Valid min
    InsuranceInputSchema(age=18, sex="male", bmi=20.0, children=0, smoker="no", region="northeast")
    # Valid max
    InsuranceInputSchema(age=100, sex="male", bmi=20.0, children=0, smoker="no", region="northeast")
    
    # Below min
    with pytest.raises(ValidationError):
        InsuranceInputSchema(age=17, sex="male", bmi=20.0, children=0, smoker="no", region="northeast")
    # Above max
    with pytest.raises(ValidationError):
        InsuranceInputSchema(age=101, sex="male", bmi=20.0, children=0, smoker="no", region="northeast")

def test_bmi_boundary_limits():
    # Below min 10.0
    with pytest.raises(ValidationError):
        InsuranceInputSchema(age=25, sex="male", bmi=9.9, children=0, smoker="no", region="northeast")
    # Above max 65.0
    with pytest.raises(ValidationError):
        InsuranceInputSchema(age=25, sex="male", bmi=65.1, children=0, smoker="no", region="northeast")

def test_children_boundary_limits():
    with pytest.raises(ValidationError):
        InsuranceInputSchema(age=25, sex="male", bmi=25.0, children=-1, smoker="no", region="northeast")
    with pytest.raises(ValidationError):
        InsuranceInputSchema(age=25, sex="male", bmi=25.0, children=11, smoker="no", region="northeast")

def test_categorical_rejection():
    with pytest.raises(ValidationError):
        InsuranceInputSchema(age=25, sex="alien", bmi=25.0, children=0, smoker="no", region="northeast")
    with pytest.raises(ValidationError):
        InsuranceInputSchema(age=25, sex="male", bmi=25.0, children=0, smoker="occasionally", region="northeast")
    with pytest.raises(ValidationError):
        InsuranceInputSchema(age=25, sex="male", bmi=25.0, children=0, smoker="no", region="central")

def test_extra_forbidden():
    with pytest.raises(ValidationError):
        InsuranceInputSchema(age=25, sex="male", bmi=25.0, children=0, smoker="no", region="northeast", extra_val=123)
