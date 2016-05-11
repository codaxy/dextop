﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Collections.Concurrent;
using Codaxy.Common.Reflection;
using System.Reflection;

namespace Codaxy.Dextop.Data
{
	/// <summary>
	/// 
	/// </summary>
    public class DextopModelManager
    {
        internal ConcurrentDictionary<Type, DextopModel> models = new ConcurrentDictionary<Type, DextopModel>();
        ConcurrentDictionary<Type, DextopModelTypeMeta> metas = new ConcurrentDictionary<Type, DextopModelTypeMeta>();
        DextopApplication Application { get; set; }

        internal DextopModelManager(DextopApplication application)
        {
            Application = application;
        }

		/// <summary>
		/// Gets the registered model for given type.
		/// </summary>
		/// <param name="type">The type.</param>
		/// <returns></returns>
        public DextopModel GetRegisteredModel(Type type)
        {
            DextopModel model;
            if (models.TryGetValue(type, out model))
                return model;
            throw new DextopException("Model for type '{0}' not registered.", type);
        }

		/// <summary>
		/// Gets the model for given type.
		/// </summary>
		/// <param name="type">The type.</param>
		/// <returns></returns>
        public DextopModel GetModel(Type type)
        {
            DextopModel model;
            if (models.TryGetValue(type, out model))
                return model;
            return BuildModel(type);
        }

		/// <summary>
		/// Gets the meta object associated with the model.
		/// </summary>
		/// <param name="type">The type.</param>
		/// <returns></returns>
        public DextopModelTypeMeta GetModelMeta(Type type)
        {
            DextopModelTypeMeta meta;
            if (metas.TryGetValue(type, out meta))
                return meta;
            return BuildModel(type).Meta;
        }

		/// <summary>
		/// Registers the model for given type.
		/// </summary>
		/// <param name="type">The type.</param>
		/// <param name="model">The model.</param>
        public void RegisterModel(Type type, DextopModel model)
        {
            if (model.Meta == null)
                throw new DextopException("Model for type '{0}' has no required meta data.", type);
            if (!models.TryAdd(type, model) || metas.TryAdd(type, model.Meta))
                throw new DextopException("Model for type '{0}' already registered.", type);
        }

        /// <summary>
        /// Builds the model for given type.
        /// </summary>
        /// <param name="type">The type.</param>
        /// /// <returns>Dextop Model</returns>
        public DextopModel BuildModel(Type type)
        {
            var attribute = AttributeHelper.GetCustomAttribute<DextopModelAttribute>(type, false);
            return BuildModel(type, attribute);
        }
		
        internal DextopModel BuildModel(Type type, DextopModelAttribute modelAttribute)
        {
            DextopModelTypeMeta meta;
            
            if (modelAttribute != null)
                meta = new DextopModelTypeMeta
                {
                    IdField = modelAttribute.Id,
                    Identifier = modelAttribute.Identifier,
                    ModelName = modelAttribute.Name,
                    DefaultSerializerType = modelAttribute.DefaultSerializer
                };
            else
                meta = new DextopModelTypeMeta();

            if (meta.ModelType != null && meta.ModelType != type)
                throw new DextopException("Type mismatch.");

            var excludeFields = new HashSet<String>();
            if (meta.ExcludedFields != null)
                foreach (var f in meta.ExcludedFields)
                    excludeFields.Add(f);

            var properties = type.GetProperties();
            var fields = type.GetFields();

            var combined = properties.Concat((MemberInfo[])fields);

            var model = new DextopModel
            {
                Meta = meta
            };

            List<String> idCandidates = new List<string>();
            var dfat = new DextopModelFieldAttribute();

            foreach (var p in combined)
            {
                Type fieldType;
                if (p is PropertyInfo)
                    fieldType = ((PropertyInfo)p).PropertyType;
                else
                    fieldType = ((FieldInfo)p).FieldType;

                var ea = AttributeHelper.GetCustomAttribute<DextopModelExcludeAttribute>(p, true);
                if (ea != null)
                    excludeFields.Add(p.Name);
                if (!excludeFields.Contains(p.Name))
                {
                    var fat = AttributeHelper.GetCustomAttribute<DextopModelFieldAttribute>(p, true) ?? dfat;
                    String ft, et;
                    if (!DextopModelFieldTypeMapper.TryGetFieldTypeName(fieldType, out ft, out et))
                    {
                        excludeFields.Add(p.Name);
                        continue;
                    }
                    var field = new DextopModel.Field
                    {
                        name = p.Name,
                        type = fat.type ?? ft,
                        defaultValue = fat.defaultValue,
                        allowNull = fat.useNotNull ? false : true,//fieldType.IsClass || Codaxy.Common.Nullable.IsNullableType(type) || fieldType == typeof(String)
                        dateFormat = fat.dateFormat,
                        mapping = fat.mapping,
                        sortDir = fat.sortDir,
                        persist = fat.persist,
                        convert = fat.convert,
                        sortType = fat.sortType
                    };
                    model.Fields.Add(field);
                    if (meta.IdField == null)
                    {
                        var ida = AttributeHelper.GetCustomAttribute<DextopModelIdAttribute>(p, true);
                        if (ida != null)
                        {
                            meta.IdField = p.Name;
                            field.allowNull = true;
                        }
                        else
                        {
                            if (p.Name.EndsWith("ID") || p.Name.EndsWith("id") || p.Name.EndsWith("Id"))
                                idCandidates.Add(p.Name);
                        }
                    }

                    var validations = AttributeHelper.GetCustomAttributes<DextopModelValidationAttribute>(p, true);
                    foreach (var v in validations)
                    {
                        var validation = v.ToValidation(p.Name, fieldType);
                        model.Validations.Add(validation);
                    }
                }
            }

            if (meta.IdField == null)
            {
                if (idCandidates.Count == 1)
                {
                    meta.IdField = idCandidates[0];
                }
                else
                    throw new DextopException("Model for type '{0}' could not be generated as id field could not be resolved.", type);
            }

            model.idProperty = meta.IdField;

            if (String.IsNullOrEmpty(meta.Identifier)) // set default identifier
                meta.Identifier = "nullable";

			if (meta.ModelName == null)
				meta.ModelName = Application.MapTypeName(type, ".model");
            
            meta.ExcludedFields = excludeFields.Count == 0 ? null : excludeFields.ToArray();
            meta.Fields = model.Fields.Select(a => a.name).ToArray();
            meta.ModelType = type;
            meta.IsTreeModel = modelAttribute.IsTreeModel;
            
            if (!metas.TryAdd(type, meta))
                throw new DextopException("Model for type '{0}' already registered.", type);

            return model;                
        }
    }
}
