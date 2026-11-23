<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	<xsl:template match="iomap/power/io[@module='JASPER']/voltage_setpoint">
		<voltage_setpoint offset="84" mask="0x0000" digital_high="4095" digital_low="0"/>
	</xsl:template>

	<xsl:template match="iomap/power/io[@module='JASPER']/dt_current">
		<dt_current offset="86" digital_high="65535" digital_low="0" />
	</xsl:template>

	<xsl:template match="iomap/power/io[@module='JASPER']/dt_current_time"/>
	
	<xsl:template match="iomap/power/io[@module='JASPER']/metalbeam_voltage_telemetry">
		<pulse_average_voltage_telemetry offset="112"/>
	</xsl:template>
	
	<xsl:template match="iomap/power/io[@module='JASPER']/*[last()]">
		<xsl:copy-of select="."/>
		<mig_dip_detachment_current offset="108" mask="0xA000" digital_high="4095" digital_low="0"/>
		<mig_dip_burnback_current offset="108" mask="0xC000" digital_high="4095" digital_low="0"/>
		<mig_dip_detachment_wetting_time offset="108" mask="0x9000" digital_high="4095" digital_low="0"/>
		<mig_dip_min_burnback_time offset="108" mask="0xD000" digital_high="4095" digital_low="0"/>
		<mig_dip_detachment_ramp_rate offset="108" mask="0xB000" digital_high="4095" digital_low="0"/>
		<pulse_average_current_telemetry offset="111"/>
		<pulse_is_telemetry_valid offset="116"/>
		<mig_open_circuit_current offset="84" mask="B000" digital_high="4095" digital_low="0"/>
	</xsl:template>
	
	<!-- Do not change the template below -->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>