<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line-->

	<xsl:template match="/user_preferences/preference[@tag='should_enable_datalog_in_test_mode']">
		<xsl:copy-of select="."/>
		<preference tag="should_log_gas_flow_telemetry" value="false"/>
		<preference tag="should_log_travel_position" value="true"/>
		<preference tag="should_log_wire_position" value="true"/>
		<preference tag="should_log_wire_manipulator_up_down_position" value="true"/>
		<preference tag="should_log_wire_manipulator_in_out_position" value="true"/>
	</xsl:template>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>
</xsl:stylesheet>