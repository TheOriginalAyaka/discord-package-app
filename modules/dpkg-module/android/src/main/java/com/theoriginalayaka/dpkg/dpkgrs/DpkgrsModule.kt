package com.theoriginalayaka.dpkg.dpkgrs

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import uniffi.dpkg_rs.ExtractObserver
import uniffi.dpkg_rs.ExtractedData
import uniffi.dpkg_rs.startExtraction
import java.lang.reflect.Field
import java.lang.reflect.Modifier


class DpkgrsModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("Dpkgrs")

    Events("onProgress", "onError", "onComplete")

    Function("process") { filePath: String ->
      val observer = ExObserver(this@DpkgrsModule)
      startExtraction(filePath, observer)
    }
  }
}

class ExObserver(private val module: DpkgrsModule) : ExtractObserver {
  override fun onProgress(step: String) {
    module.sendEvent("onProgress", mapOf("step" to step))
  }

  override fun onError(message: String) {
    module.sendEvent("onError", mapOf("message" to message))
  }

  override fun onComplete(result: ExtractedData) {
    module.sendEvent("onComplete", mapOf("result" to result.toDictionary()))
  }
}

fun ExtractedData.toDictionary(): Any? {
  return convertToDict(this)
}

private fun convertToDict(obj: Any?): Any? {
  if (obj == null) return null

  // Handle primitive types and strings
  when (obj) {
    is String, is Number, is Boolean -> return obj
    is Collection<*> -> return obj.map { convertToDict(it) }
    is Array<*> -> return obj.map { convertToDict(it) }
    is Map<*, *> -> return obj.mapValues { convertToDict(it.value) }
  }

  // Handle objects using Java reflection
  return try {
    val clazz = obj::class.java
    val fields = getAllFields(clazz)
    val result = mutableMapOf<String, Any?>()

    fields.forEach { field ->
      try {
        field.isAccessible = true
        if (!Modifier.isStatic(field.modifiers)) {
          val value = field.get(obj)
          result[field.name] = convertToDict(value)
        }
      } catch (e: Exception) {
        // Skip inaccessible fields
      }
    }

    if (result.isEmpty()) obj.toString() else result
  } catch (e: Exception) {
    obj.toString()
  }
}

private fun getAllFields(clazz: Class<*>): List<Field> {
  val fields = mutableListOf<Field>()
  var currentClass: Class<*>? = clazz

  while (currentClass != null) {
    fields.addAll(currentClass.declaredFields)
    currentClass = currentClass.superclass
  }

  return fields
}