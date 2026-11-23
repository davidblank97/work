<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line-->

	<xsl:template match="/user_preferences/preference[@tag='mig_cv_average_period']">
		<xsl:copy-of select="."/>
		<xsl:choose>
			<xsl:when test="/user_preferences/preference[@tag='should_respond_to_alarms_from_wire_manipulator_up_down']"/>
			<xsl:otherwise>
				<preference tag="should_respond_to_alarms_from_wire_manipulator_up_down" value="true"/>
				<preference tag="should_respond_to_alarms_from_wire_manipulator_in_out" value="true"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>
</xsl:stylesheet>