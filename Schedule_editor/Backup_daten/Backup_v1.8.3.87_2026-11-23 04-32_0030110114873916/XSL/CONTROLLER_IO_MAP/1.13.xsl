<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> 
  <xsl:output indent="no" omit-xml-declaration="yes"/>
  <xsl:preserve-space elements="*" />
  <!-- Add your XSL Transformations below this line -->

  <xsl:template match="iomap/power/io[@module='JASPER']/dt_mode"/>
  <xsl:template match="/iomap/system/io[@module='JASPER']/voltage_setpoint"/> 
  <xsl:template match="/iomap/system/io[@module='JASPER']/voltage_deadband"/> 
  <xsl:template match="/iomap/system/io[@module='JASPER']/mig_dynamic_mode"/> 

  <xsl:template match="iomap/power/io[@module='JASPER']/pulse_mode">
    <mig_pulse_settings offset="84" mask="0x3000" digital_high="4095" digital_low="0"/>
  </xsl:template>

  <xsl:template match="iomap/power/io[@module='JASPER']/mig_cv_mode">
    <mig_process_select offset="84" mask="0x9000" digital_high="4095" digital_low="0"/>
  </xsl:template> 

  <xsl:template match="iomap/power/io[@module='JASPER']/voltage_p_term">
    <voltage_p_term offset="84" mask="0x4000" digital_high="100" digital_low="0"/>
  </xsl:template> 

  <xsl:template match="iomap/power/io[@module='JASPER']/metalbeam_voltage_telemetry">
    <metalbeam_voltage_telemetry offset="84"/>
  </xsl:template>

  <xsl:template match="/iomap/system/io[@module='JASPER']/voltage_telemetry" > 
    <xsl:copy-of select="."/>
    <voltage_setpoint offset="84" mask="0x0000" digital_high="0" digital_low="4095"/>
    <voltage_deadband offset="84" mask="0xD000" analog_high="50" analog_low="0" digital_high="4095" digital_low="0"/>
 </xsl:template>  

  <xsl:template match="iomap/power/io[@module='JASPER']/*[last()]">
    <xsl:copy-of select="."/>
    <mig_arc_start_mode offset="84" mask="0xC000" digital_high="4095" digital_low="0"/>
    <mig_arc_start_initial_amps offset="108" mask="0x4000" digital_high="4095" digital_low="0"/>
    <mig_arc_start_initial_amps_time offset="108" mask="0x5000" digital_high="4095" digital_low="0"/>
    <mig_arc_start_initial_amps_multiplier offset="108" mask="0x6000" digital_high="4095" digital_low="0"/>
    <mig_process_enabled offset="97" bit="0"/>
    <mig_dynamics_short_status offset="110"/>
    <mig_dynamics_start_delay offset="108" mask="0x7000" digital_high="4095" digital_low="0"/>
    <mig_dynamics_max_current offset="108" mask="0x8000" digital_high="4095" digital_low="0"/>
  </xsl:template>

  <!-- Do not change the template below -->
  <xsl:template match="node()|@*" name="identity">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template> 

</xsl:stylesheet>