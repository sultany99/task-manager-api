const buildCondition = ([field, operator, value]) => {
    switch (operator) {
        case 'ilike':
            return { [field]: { $regex: value, $options: 'i' } };

        case 'like':
            return { [field]: { $regex: value } };

        case '=':
            return { [field]: value };

        case '!=':
            return { [field]: { $ne: value } };

        case 'in':
            return { [field]: { $in: value } };

        default:
            throw new Error(`Unsupported operator: ${operator}`);
    }
};


const buildFilterFromDomain = (domain) => {
    // Single condition
    if (
        Array.isArray(domain) &&
        domain.length === 3 &&
        typeof domain[0] === 'string'
    ) {
        return buildCondition(domain);
    }

    // Logical operators
    const [operator, ...operands] = domain;

    switch (operator) {
        case '&':
            return {
                $and: operands.map(buildFilterFromDomain)
            };

        case '|':
            return {
                $or: operands.map(buildFilterFromDomain)
            };

        case '!':
            return {
                $nor: [buildFilterFromDomain(operands[0])]
            };

        default:
            // Implicit AND (Odoo-style)
            if (Array.isArray(domain)) {
                return {
                    $and: domain.map(buildFilterFromDomain)
                };
            }

            throw new Error('Invalid domain syntax');
    }
};
module.exports = { buildFilterFromDomain };