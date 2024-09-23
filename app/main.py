def is_pyrimidine_or_purine(nucleotide: str) -> bool:
    pyrimidines = {'C', 'T', 'U'}
    purines = {'A', 'G'}
    
    if nucleotide in pyrimidines:
        return True
    elif nucleotide in purines:
        return False
    
    return None
