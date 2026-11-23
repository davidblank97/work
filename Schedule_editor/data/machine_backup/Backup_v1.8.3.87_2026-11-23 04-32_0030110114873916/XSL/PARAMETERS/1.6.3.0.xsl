<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	<xsl:template match="/Parameters/param[@id='268304']">
		<xsl:copy-of select="."/>
		<param id="264628">
			<name>TILT JOG</name>
			<short_name>JOG</short_name>
			<desc>The speed at which the TILT axis will move while the operator is moving from one position to another. Jogging means positioning the axis while the system is not welding.</desc>
		</param>
		<param id="264660">
			<name>TILT STEP</name>
			<short_name>STEP</short_name>
			<desc>The distance the torch will move along the TILT axis when the step function is used. A step function is when a user commands the robot to move a specified distance in a given direction, usually to make fine positions moves.</desc>
		</param>
	</xsl:template>
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>