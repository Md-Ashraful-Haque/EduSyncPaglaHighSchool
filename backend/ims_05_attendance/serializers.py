# ims_05_attendance/serializers.py

from rest_framework import serializers
from .models import AttendanceDay, StudentAttendance
from ims_02_account.models import Student  # adjust import


class StudentMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['id', 'student_id','roll_number', 'name', 'name_bangla','fathers_name','phone_number']


class StudentAttendanceSerializer(serializers.ModelSerializer):
    student = StudentMinimalSerializer(read_only=True)
    student_id = serializers.PrimaryKeyRelatedField(
        queryset=Student.objects.all(),
        source='student',
        write_only=True
    )

    class Meta:
        model = StudentAttendance
        fields = [
            'id',
            'student',
            'student_id',
            'status',
            'entry_time',
            'exit_time',
            'note',
        ]


class AttendanceDaySerializer(serializers.ModelSerializer):
    student_attendances = StudentAttendanceSerializer(many=True)

    class Meta:
        model = AttendanceDay
        fields = [
            'id',
            'date',
            'attendance_type',
            'student_attendances',
        ]


class AttendanceSaveSerializer(serializers.Serializer):
    attendance_day_id = serializers.IntegerField()
    students = StudentAttendanceSerializer(many=True)

    def validate_attendance_day_id(self, value):
        if not AttendanceDay.objects.filter(pk=value).exists():
            raise serializers.ValidationError("Invalid attendance_day_id")
        return value
    
    def create_or_update(self):
        """
        Manually handle bulk create/update.
        """
        # print("&&&&&&&&&&&&&&&&&&&&&&&&& In create_or_update &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
        attendance_day_id = self.validated_data['attendance_day_id']
        students_data = self.validated_data['students']
        attendance_day = AttendanceDay.objects.get(pk=attendance_day_id)
        
        # print("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")

        for item in students_data:
            student = item['student']
            status = item.get('status', 'absent')
            entry_time = item.get('entry_time')
            exit_time = item.get('exit_time')
            note = item.get('note', '')
            # print("+++++++++++++++++++++++++++++")
            # print("student: ", student)
            # print("+++++++++++++++++++++++++++++")
            obj, created = StudentAttendance.objects.update_or_create(
                attendance_day=attendance_day,
                student=student,
                defaults={
                    'status': status,
                    'entry_time': entry_time,
                    'exit_time': exit_time,
                    'note': note,
                }
            )
        return attendance_day
