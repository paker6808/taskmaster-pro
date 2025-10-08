namespace taskmaster_pro.Application.Interfaces
{
    /// <summary>
    /// Interface for data shape helper that provides methods to shape data based on provided fields.
    /// </summary>
    public interface IDataShapeHelper<T>
    {
        /// <summary>
        /// Shapes the data for a collection of entities based on the provided fields string.
        /// </summary>
        /// <param name="entities">The collection of entities to shape.</param>
        /// <param name="fieldsString">A comma-separated string representing the fields to include in the shaped data.</param>
        /// <returns>An IEnumerable of Entity objects that represent the shaped data.</returns>
        IEnumerable<IDictionary<string, object>> ShapeData(IEnumerable<T> entities, string fieldsString);

        /// <summary>
        /// Asynchronously shapes the data for a collection of entities based on the provided fields string.
        /// </summary>
        /// <param name="entities">The collection of entities to shape.</param>
        /// <param name="fieldsString">A comma-separated string representing the fields to include in the shaped data.</param>
        /// <returns>A Task that will return an IEnumerable of Entity objects that represent the shaped data.</returns>
        Task<IEnumerable<IDictionary<string, object>>> ShapeDataAsync(IEnumerable<T> entities, string fieldsString);

        /// <summary>
        /// Shapes the data for a single entity based on the provided fields string.
        /// </summary>
        /// <param name="entity">The entity to shape.</param>
        /// <param name="fieldsString">A comma-separated string representing the fields to include in the shaped data.</param>
        /// <returns>An Entity object that represents the shaped data.</returns>
        IDictionary<string, object> ShapeData(T entity, string fieldsString);
    }
}