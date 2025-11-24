
from rest_framework import serializers
from .models import * 
from ims_01_institute.models import  Class, Group, SubjectForIMS


class ExamSerializer(serializers.ModelSerializer):
    # section_name_display = serializers.CharField(source='get_section_name_display', read_only=True)
    class Meta:
        model = ExamForIMS
        fields = ['id', 'exam_name'] 


# ////////////////////////////////////// Routine Serializer //////////////////////
class RoutineItemSerializer(serializers.Serializer):
    subject_id = serializers.IntegerField()
    exam_date = serializers.DateField()
    start_time = serializers.TimeField(allow_null=True)
    end_time = serializers.TimeField(allow_null=True)


class ExamRoutineCreateSerializer(serializers.Serializer):
    exam_id = serializers.IntegerField()
    class_instance_id = serializers.IntegerField()
    group_id = serializers.IntegerField()
    publish = serializers.BooleanField(default=False)   # 👈 ADD THIS
    routines = RoutineItemSerializer(many=True)

    def validate(self, data):
        # Validate foreign keys exist
        try:
            data["exam"] = ExamForIMS.objects.get(id=data["exam_id"])
        except ExamForIMS.DoesNotExist:
            raise serializers.ValidationError({"exam_id": "Invalid exam ID"})

        try:
            data["class_instance"] = Class.objects.get(id=data["class_instance_id"])
        except Class.DoesNotExist:
            raise serializers.ValidationError({"class_instance_id": "Invalid class ID"})

        try:
            data["group"] = Group.objects.get(id=data["group_id"])
        except Group.DoesNotExist:
            raise serializers.ValidationError({"group_id": "Invalid group ID"})

        return data

    def create(self, validated_data):
        exam = validated_data["exam"]
        class_instance = validated_data["class_instance"]
        group = validated_data["group"]
        publish = validated_data.get("publish", False)
        routines = validated_data["routines"]

        # OPTIONAL: Delete old routines first
        ExamRoutine.objects.filter(
            exam=exam,
            class_instance=class_instance,
            group=group,
        ).delete()

        routine_objects = []

        for order, item in enumerate(routines):
            subject = SubjectForIMS.objects.get(id=item["subject_id"])
            print("==============================")
            print("item: ", item)
            print("==============================")

            routine_objects.append(
                ExamRoutine(
                    exam=exam,
                    class_instance=class_instance,
                    group=group,
                    subject=subject,
                    exam_date=item["exam_date"],
                    start_time=item["start_time"],
                    end_time=item["end_time"],
                    is_published=publish,
                    order=order + 1,  # auto ordering
                )
            )

        ExamRoutine.objects.bulk_create(routine_objects)

        return {"message": "Routine created successfully", "count": len(routine_objects)}



# class ExamRoutineListSerializer(serializers.ModelSerializer):
#     subject_name = serializers.CharField(source='subject.subject_name_bangla')

#     class Meta:
#         model = ExamRoutine
#         fields = [
#             'id',
#             'subject_id',
#             'subject_name',
#             'exam_date',
#             'start_time',
#             'end_time',
#             'order'
#         ]
class ExamRoutineListSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(
        source='subject.subject_name.name_bengali',
        read_only=True
    )

    class Meta:
        model = ExamRoutine
        fields = [
            'id',
            'subject_id',
            'subject_name',
            'exam_date',
            'start_time',
            'end_time',
            'order'
        ]
